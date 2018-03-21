/*global describe*/
/*global it*/
/*global afterAll*/
/*global beforeAll*/

var async = require("async");
var mongoose = require('mongoose');
var neo4j = require("neo4j");

/*
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 60;
*/

/*
mongoose.set('debug', function (coll, method, query, doc, options) {
    console.log();
    if (coll !== 'Neo4J Request') {
        coll='Mongo Request: '+coll;
    }
    console.log(coll, method, query, doc, options);
});
*/

var moneo = require("./index")({url:'http://localhost:7474'});

mongoose.Promise = global.Promise

describe("moneo", function () {
    var PersonSchema, PersonModel, ClassSchema, ClassModel;
    var graphDb;

    beforeAll(function (done) {
        mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
        graphDb = new neo4j.GraphDatabase({url: 'http://localhost:7474'});
        async.series([
                function (next) {
                    graphDb.cypher({query: "match (n) delete n"}, next);
                },
                function (next) {
                    graphDb.cypher({query: "match [r] delete r"}, next);
                }],
            done);
    });

    it("should save objects without relations", function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";

        var person2 = new PersonModel();
        person2.firstName = "Lynard";
        person2.lastName = "Skynard";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";

        async.series([person1.save, person2.save, class1.save], function (err, res) {
            expect(person1._neo4j).toBeTruthy();
            expect(person2._neo4j).toBeTruthy();
            expect(class1._neo4j).toBeTruthy();

            expect(person1._id instanceof mongoose.Types.ObjectId).toBeTruthy();
            expect(person2._id instanceof mongoose.Types.ObjectId).toBeTruthy();
            expect(class1._id instanceof mongoose.Types.ObjectId).toBeTruthy();

            done(err);
        });
    });

    it('should save simple DBRef property', function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";
        class1.teacher = person1;

        async.series([person1.save, class1.save], function (err, res) {
            expect(person1._neo4j).toBeTruthy();
            expect(class1._neo4j).toBeTruthy();

            expect(person1._id instanceof mongoose.Types.ObjectId).toBeTruthy();
            expect(class1._id instanceof mongoose.Types.ObjectId).toBeTruthy();

            expect(class1.teacher._id instanceof mongoose.Types.ObjectId).toBeTruthy();
            expect(class1.teacher._id).toBe(person1._id);

            done();
        });
    });

    it("should create node objects once per document", function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";

        async.series([person1.save, person1.save, function (next) {
            graphDb.cypher({query: 'match (n:Person {mongoId:\'' + person1._id.toHexString() + '\'}) return n'}, next);
        }], function (err, res) {
            try {
                expect(res[2].length).toBe(1);
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done(err);
        });
    });

    it("should create node with props", function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";
        person1.mongoSpecificValue1 = "mongo 1";
        person1.mongoSpecificValue2 = "mongo 2";

        async.series([person1.save, function (next) {
            graphDb.cypher({query: 'match (n:Person {mongoId:\'' + person1._id.toHexString() + '\'}) return n limit 1'}, next);
        }], function (err, res) {
            try {
                var node = res[1][0].n;
                expect(node.properties.firstName).toBe('Neil');
                expect(node.properties.lastName).toBe('Young');
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done(err);
        });
    });

    it('should create relation for simple DBRef property', function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";
        class1.teacher = person1;

        async.series([person1.save, class1.save, function (next) {
            graphDb.cypher({query: 'match (n:Person {mongoId:\'' + person1._id.toHexString() + '\'})-[r:Taught_By]-(c:Class) return n,r,c'}, next);
        }], function (err, res) {
            try {
                expect(res[2].length).toBe(1);
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done();
        });
    });

    it('should create relation with props for simple DBRef property', function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";
        class1.supervisor.person = person1;
        class1.supervisor.startDate = new Date();

        async.series([person1.save, class1.save, function (next) {
            graphDb.cypher({query: 'match (n:Person {mongoId:\'' + person1._id.toHexString() + '\'})-[r:Supervised_By]-(c:Class) return n,r,c'}, next);
        }], function (err, res) {
            try {
                expect(res[2].length).toBe(1);
                expect(res[2][0].r.properties.startDate).toBeDefined();
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done();
        });
    });

    it('should create relations for array of DBRef property', function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Neil";
        person1.lastName = "Young";
        var person2 = new PersonModel();
        person1.firstName = "Lynard";
        person1.lastName = "Skinard";
        var person3 = new PersonModel();
        person1.firstName = "Lou";
        person1.lastName = "Reed";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";
        class1.students = [person1, person2, person3];

        async.series([person1.save, person2.save, person3.save, class1.save, function (next) {
            graphDb.cypher({query: 'match (n:Class {mongoId:\'' + class1._id.toHexString() + '\'})-[r:Teaches]-(c:Person) return n,r,c'}, next);
        }], function (err, res) {
            try {
                expect(res[4].length).toBe(3);
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done();
        });
    });

    it('should create relations with props for nested doc array with DBRef property', function (done) {
        var person1 = new PersonModel();
        person1.firstName = "Lynard";
        person1.lastName = "Skinard";

        var class1 = new ClassModel();
        class1.title = "Rock'nRoll 101";

        var class2 = new ClassModel();
        class2.title = "Advanced Rock'nRoll";

        var class3 = new ClassModel();
        class3.title = "Country 101";

        person1.takenClasses.push({
            class: class1,
            grade: 90,
            year: 1977
        });

        person1.takenClasses.push({
            class: class2,
            grade: 80,
            year: 1969
        });

        person1.takenClasses.push({
            class: class3,
            grade: 89,
            year: 1950
        });

        async.series([class1.save, class2.save, class3.save, person1.save, function (next) {
            graphDb.cypher({query: 'match (n:Person {mongoId:\'' + person1._id.toHexString() + '\'})-[r:Takes_Class]-(c:Class) return n,r,c'}, next);
        }], function (err, res) {
            expect(err).not.toBeNull();
            try {
                expect(res[4].length).toBe(3);
            }
            catch (err) {
                expect(err).toBeNull();
            }
            finally {
            }
            done();
        });
    });

    it('should run a cypher query',function(done){
        PersonModel.cypherQuery({query: 'match (n:Person)-[r:Takes_Class]-(c:Class) return n,r,c'}, function (err, res) {
            expect(res.length).toBeGreaterThan(0);
            done();
        });
    });
});
