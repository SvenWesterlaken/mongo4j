const mongoose = require('mongoose');
const neo4j = require('../lib/neo4j');

const int = require('neo4j-driver').int;
const toNumber = require('neo4j-driver').integer.toNumber;

const Person = require('./models/person');
const Class = require('./models/class');

const mongoUri = process.env.MONGO_URI || "127.0.0.1";

mongoose.Promise = global.Promise;

before((done) => {
  // Connect to mongo
  if(mongoose.connection.readyState == 0) {
    mongoose.connect(`mongodb://${mongoUri}:27017/moneo-test`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => done());
  } else {
    done();
  }
});

beforeEach(function (done) {
  // Drop all mongo documents & Neo4j Nodes before each test
  this.timeout(10000);
  const session = neo4j.getDriver().session();

  Promise.all([Person.deleteMany({}), Class.deleteMany({}), session.run("MATCH (n) DETACH DELETE n")])
    .then(() => session.close())
    .then(() => done())
    .catch((err) => done(err));
});

after((done) => {
  neo4j.close().then(done);
});

// Chai Setup
const chai = require('chai');

const expect = chai.expect;

chai.use(require('chai-things'));
chai.use(require('chai-properties'));
chai.use(require('chai-as-promised'));

module.exports = {
  chai,
  expect,
  Person,
  Class,
  neo4j,
  int,
  toNumber
}
