const { Person, Class, neo4j, chai, expect, int } = require('../helper');

describe('Mongo4J Deletion', () => {

  let neil;
  let session;

  beforeEach(() => {
    neil = new Person({
      firstName: "Neil",
      lastName: "Young",
      mongoSpecificValue1: "test",
      mongoSpecificValue2: "test",
      address: {
        city: "Brentwood",
        street: "Barleau St."
      }
    });

    session = neo4j.getDriver().session();
  });

  afterEach((done) => {
    session.close().then(done)
  })

  it('Delete a single item', (done) => {

    neil.save().then((neil) => {
      return neil.remove();
    }).then((result) => {

      return session.run('MATCH (n)-[r]-() RETURN n, r;');

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(0);

      done();

    });

  });

})
