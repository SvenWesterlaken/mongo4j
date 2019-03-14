const { Person, neo4j, driver, chai, expect } = require('../helper');
const neo4jUri = process.env.NEO_URI || "bolt://127.0.0.1";

describe('Simple Cypher queries', () => {
    before('reset the neo4j driver', (done) => {
      neo4j.reset();
      neo4j.init(neo4jUri, {user: 'neo4j', pass: 'new'});
      done();
    });

    beforeEach('Add 2 nodes to neo4j', (done) => {
        let session = neo4j.getDriver().session();
        session.run('CREATE ' +
                    '(j:Person {name : {james} }), ' +
                    '(n:Person {name : {neil} }) ' +
                    'RETURN j,n;', {james: 'James', neil: 'Neil'})
        .then(() => {
            session.close()
            done();
        });
    });

    it('Should run a Cypher query without any other arguments', (done) => {
        const query = 'MATCH (n:Person)-[r:Takes_Class]-(c:Class) return n;';
        const result = Person.cypherQuery(query);

        expect(result).to.be.a('promise');
        expect(Promise.all([
            expect(result).to.eventually.have.property('records'),
            expect(result).to.eventually.not.be.null
        ])).notify(done);
    });

    it('Should return a single parced neo4j document', (done) => {
        const query = 'MATCH (n:Person {name: {nameParam} }) RETURN n;';
        const result = Person.cypherQuery(query, {nameParam: 'James'}, { parse: true });

        expect(result).to.be.a('promise');
        expect(Promise.all([
            expect(result).to.eventually.not.have.a.property('records'),
            expect(result).to.eventually.not.to.be.an('array'),
            expect(result).to.eventually.have.a.property('name'),
            expect(result).to.eventually.not.be.null
        ])).notify(done);
    });

    it('Should return an parced array of neo4j documents', (done) => {
        const query = 'MATCH (n:Person) RETURN n;';
        const result = Person.cypherQuery(query, { parse: true });

        expect(result).to.be.a('promise');
        expect(Promise.all([
            expect(result).to.eventually.not.have.a.property('records'),
            expect(result).to.eventually.be.an('array'),
            expect(result).to.eventually.all.have.a.property('name'),
            expect(result).to.eventually.not.be.null
        ])).notify(done);
    });

    it('Should return a subscription instead of a promise', (done) => {
        const query = 'MATCH (n:Person) RETURN n;';
        const result = Person.cypherQuery(query, { sub: true });

        expect(result).to.not.be.a('promise');
        expect(result).to.not.be.null;
        done();
    });

    it('Should return an error when both sub and parse set to true', (done) => {
        const query = 'MATCH (n:Person) RETURN n;';

        //Function needs to be wrapped in order to catch the error accordingly
        expect(() => Person.cypherQuery(query, { sub: true, parse: true })).to.throw('Parsing is only possible in case of a Promise, with a subscription you will need to do it manually');
        done();
    });

    it('Should return an error if query is not a string', (done) => {
        const query = 122;

        //Function needs to be wrapped in order to catch the error accordingly
        expect(() => Person.cypherQuery(query)).to.throw('Cypher query must be a string');
        done();
    });

});
