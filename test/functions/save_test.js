'use strict';

const { Person, Class, driver, chai, expect, int } = require('../helper');

describe('Mongo4J Saving', () => {
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

    session = driver.session();
  });

  afterEach(() => {
    session.close();
  })

  it('Save a single person in Mongo & Neo4J', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);

      return session.run('MATCH ' +
                         '(n:Person {m_id : {id} }) ' +
                         'RETURN n;', {id: neil._id.toString()});

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(1);
      expect(properties).to.not.have.a.property('mongoSpecificValue1');
      expect(properties).to.not.have.a.property('mongoSpecificValue2');
      expect(properties).to.have.a.property('m_id');
      done();
    });

  });

  it('Save multiple persons in Mongo & Neo4J', (done) => {
    const henry = new Person({firstName: "Henry", lastName: "McCoverty"});
    const daniel = new Person({firstName: "Daniel", lastName: "Durval"});
    const jason = new Person({firstName: "Jason", lastName: "Campbell"});

    Person.insertMany([neil, daniel, jason, henry]).then((result) => {

      expect(result).to.not.be.null,
      expect(result).to.have.a.lengthOf(4),
      expect(result).to.contain.something.with.a.property('firstName', neil.firstName);

      return session.run('MATCH (n:Person) RETURN n;');

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(4);
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.not.have.a.property('mongoSpecificValue1');
      expect(properties).to.not.have.a.property('mongoSpecificValue2');
      done();
    });

  });

  it('Save a subdocument as a different Node', (done) => {
    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('address', neil.address);

      return session.run('MATCH (n:Person)-[p]-(a) RETURN n,p,a;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const properties = result.records[0]._fields[0].properties;

      expect(results).to.have.a.lengthOf(3);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.not.have.a.property('mongoSpecificValue1');
      expect(properties).to.not.have.a.property('mongoSpecificValue2');
      done();
    });
  });

  it('Save an array of subdocuments as multiple different nodes', (done) => {
    const chemistry = new Class({
      title: 'Chemistry',
      books: [{
        title: 'Organic Chemistry as a Second Language',
        author: 'David Klein'
      }, {
        title: 'Chemistry: A Molecular Approach',
        author: 'Nivaldo J. Tro'
      }]
    });

    chemistry.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result.books).to.have.a.lengthOf(2);

      return session.run('MATCH (d)-[pa]-(a:Class)-[pb]-(n) RETURN d,pa,a,pb,n;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const properties = results[0].properties;

      expect(results).to.have.a.lengthOf(5);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');

      done();

    });
  });

  it('Save a simple document reference as a relationship in Neo4J', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('address', neil.address);

      const chemistry = new Class({
        title: 'Chemistry',
        teacher: result._id
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('teacher');

      return session.run('MATCH (n:Class)-[p]-(a:Person) RETURN n,p,a;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const properties = result.records[0]._fields[0].properties;

      expect(results).to.have.a.lengthOf(3);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');
      done();
    });

  });

  it('Save an array of document references as multiple relationships in Neo4J', (done) => {
    const henry = new Person({firstName: "Henry", lastName: "McCoverty"});
    const daniel = new Person({firstName: "Daniel", lastName: "Durval"});

    Person.insertMany([daniel, henry]).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.lengthOf(2);
      expect(result).to.contain.something.with.a.property('firstName', henry.firstName);
      expect(result).to.contain.something.with.a.property('lastName', daniel.lastName);

      const chemistry = new Class({
        title: 'Chemistry',
        students: [result[0]._id, result[1]._id]
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result.students).to.be.an('Array');
      expect(result.students).to.have.a.lengthOf(2);

      return session.run('MATCH (h:Person)-[pa]-(a:Class)-[pb]-(d:Person) RETURN h,pa,a,pb,d;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const properties = results[0].properties;

      expect(results).to.have.a.lengthOf(5);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');
      done();

    });

  });

  it('Save a nested document reference as a node and a relationship with properties', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('address', neil.address);

      const chemistry = new Class({
        title: 'Chemistry',
        supervisor: {
          person: result._id,
          start_date: new Date('31 July 1999')
        }
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('teacher');

      return session.run('MATCH (n:Class)-[p]-(a:Person) RETURN n,p,a;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const properties = result.records[0]._fields[0].properties;
      const rel_properties = result.records[0]._fields[1].properties;

      expect(results).to.have.a.lengthOf(3);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');
      expect(rel_properties).to.have.a.property('start_date');
      done();
    });

  });

  it('Save a nested array of document references as multiple nodes and relationships with properties', (done) => {

    const chemistry = new Class({ title: 'Chemistry'});
    const mathematics = new Class({ title: 'Mathematics'});

    Class.insertMany([chemistry, mathematics]).then((result) => {

      const jack = new Person({
        firstName: "Jack",
        lastName: "Landers",
        takenClasses: [
          {
            class: result[0]._id,
            grade: 6,
            year: 2018
          }, {
            class: result[1]._id,
            grade: 8,
            year: 2017
          }
        ]
      });

      return jack.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result.takenClasses).to.be.an('Array');
      expect(result.takenClasses).to.have.a.lengthOf(2);

      return session.run('MATCH (h:Class {title: \'Chemistry\'})-[pa]-(a:Person)-[pb]-(d:Class) RETURN h,pa,a,pb,d;');

    }).then((result) => {
      const results = result.records[0]._fields;
      const first_properties = results[1].properties;
      const second_properties = results[3].properties;

      expect(results).to.have.a.lengthOf(5);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(first_properties).to.have.properties({year: int(2018), grade: int(6)});
      expect(second_properties).to.have.properties({year: int(2017), grade: int(8)});

      done();

    });
  });
});
