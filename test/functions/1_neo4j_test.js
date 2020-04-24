const neo4j = require('../../lib/neo4j');
const chai = require('chai');
const expect = chai.expect;

const neo4jUri = process.env.NEO_URI || "bolt://127.0.0.1";

describe("Neo4J driver management", () => {

  beforeEach((done) => { neo4j.reset().then(done) });
  afterEach((done) => { neo4j.reset().then(done) });
  afterEach(() => neo4j.init(neo4jUri, {user: 'neo4j', pass: 'new'}));

  //----------------------------------------
  // Reset functionality
  //----------------------------------------

  it('Should reset with single driver', (done) => {
    neo4j.init();

    expect(neo4j.driver).to.not.be.undefined;
    expect(neo4j.drivers).to.be.undefined;

    neo4j.reset().then(() => {
      expect(neo4j.driver).to.be.undefined;
      expect(neo4j.driver).to.be.undefined;
      done();
    });

  });

  it('Should reset with multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);
    expect(neo4j.driver).to.be.undefined;

    neo4j.reset();

    expect(neo4j.driver).to.be.undefined;
    expect(neo4j.driver).to.be.undefined;
  });

  //----------------------------------------
  // Creation functionality
  //----------------------------------------

  it('Should create a new driver without arguments', () => {
    neo4j.init();

    expect(neo4j.driver).to.not.be.undefined;
    expect(neo4j.drivers).to.be.undefined;
  });

  it('Should create a multiple drivers with array as argument', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);
    expect(neo4j.driver).to.be.undefined;
  });
})
