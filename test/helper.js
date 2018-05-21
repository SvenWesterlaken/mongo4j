const mongoose = require('mongoose');
const neo4j = require('../lib/neo4j');

const driver = neo4j.getDriver();

const Person = require('./models/person');
const Class = require('./models/class');

mongoose.Promise = global.Promise;

before((done) => {
  // Connect to mongo
  mongoose.connect('mongodb://127.0.0.1/moneo-test');
  mongoose.connection
    .once('open', () => done())
    .on('error', (err) => console.warn('Warning', err));
});

beforeEach((done) => {
  //Drop all mongo documents & Neo4j Nodes before each test
  const session = driver.session();
  Promise.all([Person.remove({}), Class.remove({}), session.run("MATCH (n) DETACH DELETE n")])
    .then(() => { session.close(); done(); })
    .catch((err) => done(err));
});

after(() => {
  // Close connections after tests are done
  mongoose.disconnect();
  neo4j.close();
});
