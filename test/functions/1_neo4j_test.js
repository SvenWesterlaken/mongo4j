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

  it('Should reset with multiple drivers', (done) => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);
    expect(neo4j.driver).to.be.undefined;

    neo4j.reset().then(() => {
      expect(neo4j.driver).to.be.undefined;
      expect(neo4j.driver).to.be.undefined;
      done();
    });
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

  //----------------------------------------
  // Error functionality
  //----------------------------------------

  it('Should return an error if driver is already set', (done) => {
    neo4j.init();

    expect(neo4j.driver).to.not.be.undefined;
    expect(neo4j.drivers).to.be.undefined;

    expect(() => neo4j.init()).to.throw('A driver has already been initialized')
    done();
  });

  it('Should return an error if drivers are already set', (done) => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);
    expect(neo4j.driver).to.be.undefined;

    expect(() => neo4j.init()).to.throw('Drivers have already been initialized')
    done();
  });

  it('Should return an error if driver name not set in case of multiple drivers', (done) => {
    expect(() => neo4j.init([{ url: neo4jUri }, { name: 'testconnection2', url: neo4jUri }])).to.throw('Name of Neo4j-connection must be specified, if you have more than one');
    done();
  });

  it('Should return an error if driver name is not a string in case of multiple drivers', (done) => {
    expect(() => neo4j.init([{ name: 41, url: neo4jUri }, { name: 'testconnection2', url: neo4jUri }])).to.throw('Name of Neo4j-connection must be a string');
    done();
  });

  //----------------------------------------
  // Get driver functionality
  //----------------------------------------

  it('Should return an error if getdriver is called without identifier in case of multiple drivers', (done) => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(() => neo4j.getDriver()).to.throw('You initiated more than one driver, which means you need to provide an identifier (String or Integer)');
    done();
  });

  it('Should return a driver with string identifier in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    const driver = neo4j.getDriver('testconnection1');

    expect(driver).to.not.be.null;
    expect(driver).to.be.an('object');
    expect(driver).to.have.a.property('name', 'testconnection1');
    expect(driver).to.have.a.property('driver');
  });

  it('Should return a driver with integer identifier in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    const driver = neo4j.getDriver(1);

    expect(driver).to.not.be.null;
    expect(driver).to.be.an('object');
    expect(driver).to.have.a.property('name', 'testconnection1');
    expect(driver).to.have.a.property('driver');
  });

  it('Should return an error if integer identifier is same or lower as 0 in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    expect(() => neo4j.getDriver(0)).to.throw('Identifier must be greater than 0');
  });

  it('Should return an error if integer identifier is than length of array in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    expect(() => neo4j.getDriver(3)).to.throw('Identifier is greater than the length of the array of drivers');
  });

  it('Should return an error if no drivers initialized', () => {

    expect(neo4j.drivers).to.be.undefined;
    expect(neo4j.driver).to.be.undefined;

    expect(() => neo4j.getDriver()).to.throw('No drivers have yet been initialized, do so by calling: init()');
  });

  //----------------------------------------
  // close functionality
  //----------------------------------------

  it('Should close a driver with string identifier in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    const result = neo4j.close('testconnection1');

    expect(result).to.be.a('promise');
  });

  it('Should close a driver with integer identifier in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    const result = neo4j.close(1);

    expect(result).to.be.a('promise');
  });

  it('Should return an error if integer identifier is same or lower as 0 in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    expect(() => neo4j.close(0)).to.throw('Identifier must be greater than 0');
  });

  it('Should return an error if integer identifier is than length of array in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(neo4j.drivers).to.be.an('array').with.a.lengthOf(2);

    expect(() => neo4j.close(3)).to.throw('Identifier is greater than the length of the array of drivers');
  });

  it('Should return an error if no drivers initialized', () => {
    expect(neo4j.drivers).to.be.undefined;
    expect(neo4j.driver).to.be.undefined;

    expect(() => neo4j.close()).to.throw('No drivers have yet been initialized, do so by calling: init()');
  });

  it('Should return an error if close is called without identifier in case of multiple drivers', (done) => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    expect(() => neo4j.close()).to.throw('You initiated more than one driver, which means you need to provide an identifier (String or Integer)');
    done();
  });

  it('Should return a array of promises if close is called with `true` as identifier in case of multiple drivers', () => {
    neo4j.init([{
      name: 'testconnection1',
      url: neo4jUri
    }, {
      name: 'testconnection2',
      url: neo4jUri
    }]);

    const result = neo4j.close(true);

    expect(result).to.be.a('promise');

  });

});
