const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));

const Person = require('../models/person');
const Class = require('../models/class');

describe("Moneo custom attributes", () => {

    it('Should add a custom _neo4j attribute to a new object', (done) => {

        const person1 = new Person({
            firstName: "Neil",
            lastName: "Young"
        });

        const person2 = new Person({
            firstName: "Lynard",
            lastName: "Skynard"
        });

        const class1 = new Class({
            title: "Rock'nRoll 101"
        });

        Promise.all([person1.save(), person2.save(), class1.save()])
            .catch((err) => console.error(err))
            .then((results) => {
                expect(results).to.all.have.a.property('_neo4j');
                expect(results).to.all.have.a.property('_id');

                done();
            });

    });

});
