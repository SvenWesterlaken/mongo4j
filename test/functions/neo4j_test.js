const neo4j = require('../../lib/neo4j');
const chai = require('chai');
const expect = chai.expect;

describe("Neo4J driver management", () => {

  afterEach(() => neo4j.reset());
  after(() => neo4j.init(null, {user: 'neo4j', pass: 'new'}));

  //----------------------------------------
  // Reset functionality
  //----------------------------------------

  it('Should reset with single driver', () => {

    expect(neo4j.driver).to.not.be.undefined;
    expect(neo4j.drivers).to.be.undefined;

    neo4j.reset();

    expect(neo4j.driver).to.be.undefined;
    expect(neo4j.driver).to.be.undefined;
  });

  it('Should reset with multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: 'bolt://127.0.0.1'
    }, {
      name: 'testconnection2',
      url: 'bolt://127.0.0.1'
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
      url: 'bolt://127.0.0.1'
    }, {
      name: 'testconnection2',
      url: 'bolt://127.0.0.1'
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);
    expect(neo4j.driver).to.be.undefined;
  });
})
