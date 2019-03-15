const { Person, Class, driver, chai, expect, int, toNumber } = require('../helper');

const getStats = function(results, has_delete = false) {
  return results[has_delete ? 2 : 1].summary.counters._stats
}

describe('Mongo4J Updating', () => {
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

  it('Update a simple value in Neo4J & Mongo', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);

      return result.updateNeo({firstName: 'Peter', lastName: 'Traverson'})

    }).then((results) => {
      const neo_stats = getStats(results);

      expect(neo_stats.propertiesSet).to.be.at.least(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH ' +
                         '(n:Person {m_id : {id} }) ' +
                         'RETURN n;', {id: neil._id.toString()})
    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(1);
      expect(properties).to.not.have.a.property('mongoSpecificValue1');
      expect(properties).to.not.have.a.property('mongoSpecificValue2');
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.have.a.property('first_name', 'Peter');
      expect(properties).to.not.have.a.property('first_name', 'Neil');
      expect(properties).to.have.a.property('last_name', 'Traverson');
      expect(properties).to.not.have.a.property('last_name', 'Young');

      done();

    });
  });

  it('Update subdoc as different node in neo4j', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);

      return result.updateNeo({
        address: {
          city: "Brentwood",
          street: "Coyne St."
        }
      })

    }).then((results) => {
      const neo_stats = getStats(results);

      expect(neo_stats.propertiesSet).to.be.at.least(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH (n:Person {m_id : {id}})-[p]-(a:Address) RETURN a;', {id: neil._id.toString()});

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(1);
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.have.a.property('city', 'Brentwood');
      expect(properties).to.have.a.property('street', 'Coyne St.');
      expect(properties).to.not.have.a.property('street', 'Barleau St.');

      done();

    });

  });

  it('Update multiple subdocs as different nodes in neo4j', (done) => {

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

    const chemistry_update = {
      books: [{
        title: 'Uncle Tungsten',
        author: 'Oliver Sacks'
      }, {
        title: 'PiHKAL',
        author: 'Alexander Shulgin'
      }]
    }

    chemistry.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result.books).to.have.a.lengthOf(2);

      return result.updateNeo(chemistry_update);

    }).then((results) => {
      const neo_stats = getStats(results);

      expect(neo_stats.propertiesSet).to.be.at.least(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH (d:Book {m_id: {book_id}})-[pa]-(a:Class {m_id: {id}})-[pb]-(n:Book) RETURN d,n,a;', {id: chemistry._id.toString(), book_id: chemistry.books[0]._id.toString()});

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;
      const properties_second = result.records[0]._fields[1].properties;
      const properties_class = result.records[0]._fields[2].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(1);
      expect(properties_class).to.have.a.property('title', 'Chemistry');
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.have.a.property('title', 'Uncle Tungsten');
      expect(properties).to.not.have.a.property('title', 'Organic Chemistry as a Second Language');
      expect(properties).to.have.a.property('author', 'Oliver Sacks');
      expect(properties).to.not.have.a.property('author', 'David Klein');

      done();

    });

  });

  it('Update a document reference', (done) => {
    const daniel = new Person({firstName: "Daniel", lastName: "Durval"});

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('isNew', false);

      return daniel.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(daniel);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);

      const chemistry = new Class({
        title: 'Chemistry',
        teacher: result._id
      })

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);

      const chemistry_update = {
        teacher: daniel._id
      }

      return result.updateNeo(chemistry_update);

    }).then((results) => {
      const neo_del_stats = getStats(results, true);
      const neo_stats = getStats(results);

      expect(neo_stats.relationshipsCreated).to.equal(1);
      expect(neo_del_stats.relationshipsDeleted).to.equal(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH (n:Class)-[p]-(a:Person) RETURN n,p,a;');

    }).then((result) => {
      const properties_class = result.records[0]._fields[0].properties;
      const properties_person = result.records[0]._fields[2].properties;

      expect(result.records[0]._fields).to.have.a.lengthOf(3)
      expect(properties_class).to.not.be.null;
      expect(properties_person).to.have.property('m_id', daniel._id.toString());
      expect(properties_person).to.not.have.property('m_id', neil._id.toString());
      expect(properties_person).to.have.property('first_name', daniel.firstName);
      expect(properties_person).to.not.have.property('first_name', neil.firstName);
      expect(properties_person).to.have.property('last_name', daniel.lastName);
      expect(properties_person).to.not.have.property('last_name', neil.lastName);
      done();

    });

  });

  it('Update an array of document references', (done) => {
    const daniel = new Person({firstName: "Daniel", lastName: "Durval"});
    const henry = new Person({firstName: "Henry", lastName: "McCoverty"});
    const jason = new Person({firstName: "Jason", lastName: "Campbell"});

    Person.insertMany([daniel, neil, henry, jason]).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.lengthOf(4);
      expect(result).to.contain.something.with.a.property('firstName', neil.firstName);
      expect(result).to.contain.something.with.a.property('lastName', daniel.lastName);
      expect(result).to.contain.something.with.a.property('firstName', henry.firstName);
      expect(result).to.contain.something.with.a.property('lastName', jason.lastName);

      const chemistry = new Class({
        title: 'Chemistry',
        students: [daniel._id, neil._id]
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result.students).to.be.an('Array');
      expect(result.students).to.have.a.lengthOf(2);


      const chemistry_update = {
        students: [henry._id, jason._id]
      };

      return result.updateNeo(chemistry_update);

    }).then((results) => {
      const neo_del_stats = getStats(results, true);
      const neo_stats = getStats(results);

      expect(neo_stats.relationshipsCreated).to.equal(2);
      expect(neo_del_stats.relationshipsDeleted).to.equal(2);
      expect(results[0].ok).to.equal(1);

      done();
    });

  });

  it('Update a nested document reference (relationship with properties)', (done) => {
    const oldDate = new Date('31 July 1999');
    const newDate = new Date('1 August 2000');

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
          start_date: oldDate
        }
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('teacher');

      const chemistry_update = {
        supervisor: {
          start_date: newDate
        }
      }

      return result.updateNeo(chemistry_update);

    }).then((results) => {
      const neo_del_stats = getStats(results, true);
      const neo_stats = getStats(results);

      expect(neo_stats.relationshipsCreated).to.equal(1);
      expect(neo_del_stats.relationshipsDeleted).to.equal(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH (n:Class)-[p]-(a:Person) RETURN n,p,a;');

    }).then((result) => {

      const results = result.records[0]._fields;
      const properties = result.records[0]._fields[0].properties;
      const rel_properties = result.records[0]._fields[1].properties;

      const date = toNumber(rel_properties.start_date);

      expect(results).to.have.a.lengthOf(3);
      expect(results[1]).to.have.a.property('start');
      expect(results[1]).to.have.a.property('end');
      expect(results[1]).to.have.a.property('type');
      expect(results[1]).to.not.have.a.property('labels');
      expect(properties).to.have.a.property('m_id');
      expect(rel_properties).to.have.a.property('start_date');
      expect(date).to.equal(newDate.getTime());
      expect(date).to.not.equal(oldDate.getTime());

      done();

    });

  });

  it('Update a nested array of document references (relationships with properties)', (done) => {
    const chemistry = new Class({ title: 'Chemistry'});
    const mathematics = new Class({ title: 'Mathematics'});

    Class.insertMany([chemistry, mathematics]).then((result) => {

      const jack = new Person({
        firstName: "Jack",
        lastName: "Landers",
        takenClasses: [
          {
            class: chemistry._id,
            grade: 6,
            year: 2018
          }, {
            class: mathematics._id,
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

      const classes_update = {
        takenClasses: [
          {
            class: chemistry._id,
            grade: 5,
            year: 2016
          }, {
            class: mathematics._id,
            grade: 10,
            year: 2019
          }
        ]
      }

      return result.updateNeo(classes_update);

    }).then((results) => {
      const neo_del_stats = getStats(results, true);
      const neo_stats = getStats(results);

      expect(neo_stats.relationshipsCreated).to.equal(2);
      expect(neo_del_stats.relationshipsDeleted).to.equal(2);
      expect(results[0].ok).to.equal(1);

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
      expect(first_properties).to.have.properties({year: int(2016), grade: int(5)});
      expect(first_properties).to.not.have.properties({year: int(2018), grade: int(6)});
      expect(second_properties).to.have.properties({year: int(2019), grade: int(10)});
      expect(second_properties).to.not.have.properties({year: int(2017), grade: int(8)});

      done();

    });

  });

  it('Update a simple value & a subdoc', (done) => {

    neil.save().then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.include(neil);
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('mongoSpecificValue1');
      expect(result).to.have.a.property('mongoSpecificValue2');
      expect(result).to.have.a.property('isNew', false);

      return result.updateNeo({
        firstName: 'Peter',
        lastName: 'Traverson',
        address: {
          city: "Brentwood",
          street: "Coyne St."
        }
      })

    }).then((results) => {
      const neo_stats = getStats(results);

      expect(neo_stats.propertiesSet).to.be.at.least(1);
      expect(results[0].ok).to.equal(1);

      return session.run('MATCH (n:Person {m_id : {id}})-[p]-(a:Address) RETURN a;', {id: neil._id.toString()});

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(1);
      expect(properties).to.have.a.property('m_id');
      expect(properties).to.have.a.property('city', 'Brentwood');
      expect(properties).to.have.a.property('street', 'Coyne St.');
      expect(properties).to.not.have.a.property('street', 'Barleau St.');

      done();

    });

  });

  it('Update a subdoc, simple value, multiple document references & a nested document reference', (done) => {
    const oldDate = new Date('31 July 1999');
    const newDate = new Date('1 August 2000');

    const daniel = new Person({firstName: "Daniel", lastName: "Durval"});
    const henry = new Person({firstName: "Henry", lastName: "McCoverty"});
    const jason = new Person({firstName: "Jason", lastName: "Campbell"});
    const elliot = new Person({firstName: "Elliot", lastName: "Palmer"});

    let chemistry;

    Person.insertMany([daniel, neil, henry, jason, elliot]).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.lengthOf(5);
      expect(result).to.contain.something.with.a.property('firstName', neil.firstName);
      expect(result).to.contain.something.with.a.property('lastName', daniel.lastName);
      expect(result).to.contain.something.with.a.property('firstName', henry.firstName);
      expect(result).to.contain.something.with.a.property('lastName', jason.lastName);
      expect(result).to.contain.something.with.a.property('lastName', elliot.lastName);

      chemistry = new Class({
        title: 'Chemistry',
        students: [daniel._id, neil._id],
        supervisor: {
          person: elliot._id,
          start_date: oldDate
        },
        books: [{
          title: 'Organic Chemistry as a Second Language',
          author: 'David Klein'
        }, {
          title: 'Chemistry: A Molecular Approach',
          author: 'Nivaldo J. Tro'
        }]
      });

      return chemistry.save();

    }).then((result) => {

      expect(result).to.not.be.null;
      expect(result).to.have.a.property('_id');
      expect(result).to.have.a.property('isNew', false);
      expect(result).to.have.a.property('teacher');
      expect(result.students).to.be.an('Array');
      expect(result.students).to.have.a.lengthOf(2);
      expect(result.books).to.have.a.lengthOf(2);

      const chemistry_update = {
        students: [henry._id, jason._id],
        supervisor: {
          start_date: newDate
        },
        books: [{
          title: 'Uncle Tungsten',
          author: 'Oliver Sacks'
        }, {
          title: 'PiHKAL',
          author: 'Alexander Shulgin'
        }]
      };

      return result.updateNeo(chemistry_update);

    }).then((results) => {
      const neo_del_stats = getStats(results, true);
      const neo_stats = getStats(results);

      expect(results[0].ok).to.equal(1);
      expect(neo_stats.propertiesSet).to.be.at.least(1);
      expect(neo_stats.relationshipsCreated).to.equal(3);
      expect(neo_del_stats.relationshipsDeleted).to.equal(3);

      const book_ids = [chemistry.books[0]._id.toString(), chemistry.books[1]._id.toString()];

      return session.run('MATCH (d:Book)-[pa]-(a:Class {m_id: $id})-[pb]-(s:Person {m_id: $s_id}) WHERE d.m_id IN $book_ids RETURN d,a,s,pb;', {id: chemistry._id.toString(), book_ids, s_id: elliot._id.toString()});

    }).then((result) => {
      const properties = result.records[0]._fields[0].properties;
      const properties_second = result.records[1]._fields[0].properties;

      const properties_books = [properties, properties_second];

      const properties_class = result.records[0]._fields[1].properties;
      const properties_supervisor = result.records[0]._fields[2].properties;

      const rel_properties = result.records[0]._fields[3].properties;
      const rel_fields = result.records[0]._fields[3];

      expect(result).to.not.be.null;
      expect(result.records).to.be.lengthOf(2);
      expect(properties_class).to.have.a.property('title', 'Chemistry');

      expect(properties_books).to.contain.something.with.a.property('m_id');
      expect(properties_books).to.contain.something.with.a.property('title', 'PiHKAL');
      expect(properties_books).to.not.contain.something.with.a.property('title', 'Chemistry: A Molecular Approach');
      expect(properties_books).to.contain.something.with.a.property('author', 'Alexander Shulgin');
      expect(properties_books).to.not.contain.something.with.a.property('author', 'Nivaldo J. Tro');

      expect(properties_books).to.contain.something.with.a.property('title', 'Uncle Tungsten');
      expect(properties_books).to.not.contain.something.with.a.property('title', 'Organic Chemistry as a Second Language');
      expect(properties_books).to.contain.something.with.a.property('author', 'Oliver Sacks');
      expect(properties_books).to.not.contain.something.with.a.property('author', 'David Klein');

      expect(properties).to.have.a.property('m_id');

      const date = toNumber(rel_properties.start_date);

      expect(rel_fields).to.have.a.property('start');
      expect(rel_fields).to.have.a.property('end');
      expect(rel_fields).to.have.a.property('type');
      expect(rel_fields).to.not.have.a.property('labels');
      expect(properties_supervisor).to.have.a.property('m_id');
      expect(rel_properties).to.have.a.property('start_date');
      expect(date).to.equal(newDate.getTime());
      expect(date).to.not.equal(oldDate.getTime());

      done();

    });

  });
});
