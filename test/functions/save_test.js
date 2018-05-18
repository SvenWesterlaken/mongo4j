const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));

const Person = require('../models/person');
const Class = require('../models/class');

describe('Mongoose Saving', () => {
  const test_date = new Date('31 July 1999');


  it('Should save in Mongo', (done) => {
      const neil = new Person({
        firstName: "Neil",
        lastName: "Young",
        address: {
          city: "Brentwood",
          street: "Barleau St."
        }
      });

      const henry = new Person({firstName: "Henry", lastName: "McCoverty"})

      const daniel = new Person({firstName: "Daniel", lastName: "Durval"});
      const jason = new Person({firstName: "Jason", lastName: "Campbell"});




      Promise.all([neil.save(), Person.insertMany([daniel, jason, henry])]).then((result) => {
        const chemistry = new Class({
          title: 'Chemistry',
          teacher: result[0]._id,
          supervisor: {
            person: result[1][2]._id,
            start_date: test_date
          },
          students: [
            result[1][0]._id,
            result[1][1]._id]
        });
        chemistry.save().then((result) => {

          const jack = new Person({
            firstName: "Jack",
            lastName: "Dockster",
            takenClasses: [{
              class: result._id,
              grade: 6,
              year: 2018
            }]
          });
          jack.save().then(() => done());

        });

      });

  });

});
