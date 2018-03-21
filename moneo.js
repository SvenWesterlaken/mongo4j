var mongoose = require("mongoose");
var neo4j = require("neo4j");
var async = require("async");
var util = require("util");

mongoose.Promise = global.Promise;

module.exports = function (neo4jOptions) {
    neo4jOptions = neo4jOptions || {};
    neo4jOptions.url = neo4jOptions.url || 'http://localhost:7474';

    return function (schema, options) {
        "use strict";

        if (!!mongoose.options.debug && !module.exports.httpOrg) {
            module.exports.httpOrg = neo4j.GraphDatabase.prototype.http;
            neo4j.GraphDatabase.prototype.http = function (opts, cb) {
                if (mongoose.options.debug === true) {
                    console.log("Neo4J Request:", JSON.stringify(opts.body));
                }
                else {
                    mongoose.options.debug("Neo4J Request", "", JSON.stringify(opts.body), "", "");
                }
                return module.exports.httpOrg.call(this, opts, cb);
            };
        }

        var graphDb = new neo4j.GraphDatabase(neo4jOptions);

        function cypherQuery(options, cb,_tx) {
            return graphDb.cypher(options,cb,_tx);
        }

        schema.static('cypherQuery', cypherQuery);
        schema.add({_neo4j: {type: 'Boolean', default: false}});

        schema.pre('save', function (next) {
            this._neo4j = true;
            next();
        });

        function createPropString(props, varName) {
            return Object.keys(props).map(function (key) {
                var val = props[key];
                if (typeof val === 'number') {
                    val = val.toString();
                }
                else if (val instanceof String || typeof val === 'string') {
                    val = '\'' + val.replace('\'', '\\\'') + '\'';
                }
                else if (val instanceof Array) {
                    val = util.format(val).replace('\'', '\\\'');
                }
                else if (val instanceof Date) {
                    val = '\'' + val.toISOString() + '\'';
                }
                else if (val instanceof Object) {
                    val = '\'' + util.format(val).replace('\'', '\\\'') + '\'';
                }
                else if (typeof val !== 'undefined') {
                    val = '\'' + val.toString().replace('\'', '\\\'') + '\'';
                }
                else {
                    return '';
                }
                return varName + '.' + key + '=' + val;
            }).filter(function (prop) {
                return prop.length > 0;
            }).join(',');
        }

        function normalizeType(type) {
            return type.replace(/[\s-]/g, '_');
        }

        function createNode(type, mongoId, mongoCol, mongoModel, props, next) {
            var propsStr = createPropString(props, 'n');
            return graphDb.cypher({
                    query: 'merge (n:' + normalizeType(type) + '{' +
                    'mongoId:\'' + mongoId.toHexString() + '\',' +
                    'mongoCol:\'' + mongoCol + '\',' +
                    'mongoModel:\'' + mongoModel + '\'' +
                    '}' + ' ) ' +
                    (propsStr.length > 0 ? (' on create set ' + propsStr) : '') +
                    (propsStr.length > 0 ? (' on match set ' + propsStr) : '') +
                    'return n'
                },
                function (err, result) {
                    next(err, result)
                });
        }

        function createRelation(type, mongoId1, mongoId2, props, next) {
            var propsStr = createPropString(props, 'r');
            return graphDb.cypher({
                    query: 'match ' +
                    '(n {' + 'mongoId:\'' + mongoId1.toHexString() + '\'' + '}' + ' ),' +
                    '(m {' + 'mongoId:\'' + mongoId2.toHexString() + '\'' + '}' + ' ) ' +
                    'merge (n)-[r:' + normalizeType(type) + ']->(m) ' +
                    (propsStr.length > 0 ? (' on create set ' + propsStr) : '') +
                    (propsStr.length > 0 ? (' on match set ' + propsStr) : '') +
                    ' return r'
                },
                function (err, result) {
                    next(err, result)
                });
        }

        function findNode(mongoId, next) {
            return graphDb.cypher({
                    query: 'match (n {' +
                    'mongoId:\'' + mongoId.toHexString() + '\'' +
                    '}' + ' ) ' +
                    'return n limit 1'
                },
                function (err, result) {
                    if (!err && result && result.length > 0) {
                        next(null, result[0]);
                    }
                    else {
                        next(err, null);
                    }
                });
        }

        function getProperties() {
            var props = [];
            schema.eachPath(function (name, type) {
                props.push(type);
            });
            return props;
        }

        function parsePath(path) {
            return path.split('.');
        }

        function pathString(pathArray) {
            return pathArray.join('.');
        }

        function pathPrefix(path) {
            return pathString(parsePath(path).slice(0, -1));
        }

        function pathName(path) {
            return parsePath(path).slice(-1)[0];
        }

        function samePrefix(path1, path2) {
            return pathPrefix(path1) === pathPrefix(path2);
        }

        schema.post('save', function (doc, next) {
            var properties = getProperties();

            function findSimpleRefs() {
                return properties.filter(function (prop) {
                    return !!prop.options.ref;
                }).map(function (prop) {
                    var props = properties.filter(function (prop1) {
                        return samePrefix(prop.path, prop1.path) && prop.path !== prop1.path && pathPrefix(prop.path) !== '';
                    }).map(function (prop) {
                        return prop.path;
                    }).reduce(function (obj, prop) {
                        obj[pathName(prop)] = doc.get(prop);
                        return obj;
                    }, {});
                    return {
                        name: prop.options.relName || "Relation",
                        props: props,
                        value: doc.get(prop.path)
                    };
                });
            }

            function findArrayRefs() {
                return properties.filter(function (prop) {
                    return (prop.options.type instanceof Array && !!prop.options.type[0].ref)
                }).map(function (prop) {
                    var values = doc.get(prop.path).map(function (value) {
                        return {
                            props: {},
                            value: value
                        };
                    }).filter(function (ref) {
                        return ref.value !== null && typeof ref.value !== 'undefined';
                    });

                    return {
                        name: prop.options.type[0].relName || "Relation",
                        value: values,
                        isArray: true
                    };
                });
            }

            function findNestedArrayRefs() {
                return properties.filter(function (prop) {
                    return (prop.options.type instanceof Array && Object.keys(prop.options.type[0]).some(function (key) {
                        var type = prop.options.type[0][key];
                        return !!type.ref;
                    }))
                }).map(function (prop) {
                    var nestedType = prop.options.type[0];
                    var nestedTypeProps = Object.keys(nestedType).map(function (key) {
                        return {path: key, type: prop.options.type[0][key]};
                    });
                    var relProp = nestedTypeProps.filter(function (nProp) {
                        return !!nProp.type.ref;
                    })[0];

                    var values = doc.get(prop.path).map(function (value) {
                        return {
                            props: nestedTypeProps.filter(function (nProp) {
                                return nProp !== relProp;
                            }).reduce(function (obj, nProp) {
                                obj[nProp.path] = value[nProp.path];
                                return obj;
                            }, {}),
                            value: value[relProp.path]
                        };
                    }).filter(function (ref) {
                        return ref.value !== null && typeof ref.value !== 'undefined';
                    });

                    return {
                        name: relProp.type.relName || "Relation",
                        value: values,
                        isArray: true
                    };
                });
            }

            async.series([
                function (next) {
                    //Merge node with params:
                    var docProps = properties.filter(function (prop) {
                        return !!prop.options.nodeProperty;
                    }).map(function (prop) {
                        return prop.path;
                    }).reduce(function (obj, prop) {
                        obj[pathName(prop)] = doc.get(prop);
                        return obj;
                    }, {});
                    createNode(doc.constructor.modelName, doc._id, doc.constructor.collection.name, doc.constructor.modelName, docProps, next);
                },
                function (next) {
                    //Merge relations:

                    var refs = findSimpleRefs();
                    refs = refs.concat(findArrayRefs());
                    refs = refs.concat(findNestedArrayRefs());
                    refs = refs.filter(function (ref) {
                        return ref.value !== null && typeof ref.value !== 'undefined';
                    });

                    async.mapSeries(refs, function (ref, next) {
                        if (ref.isArray) {
                            var value = ref.value;
                            async.mapSeries(value, function (v, next) {
                                var id = v.value instanceof mongoose.Types.ObjectId ? v.value : v.value._id;
                                createRelation(ref.name, doc._id, id, v.props, next);
                            }, next);
                        }
                        else {
                            var id = ref.value instanceof mongoose.Types.ObjectId ? ref.value : ref.value._id;
                            createRelation(ref.name, doc._id, id, ref.props, next);
                        }
                    }, next);
                }
            ], next);
        });

        schema.pre('insert', function (next) {
            next();
        });
        schema.post('insert', function (doc, next) {
            next();
        });

        schema.pre('update', function (next) {
            next();
        });
        schema.post('update', function (doc, next) {
            next();
        });
    };
};
