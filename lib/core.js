const mongoose = require('mongoose');
const neo4j = require('./neo4j');
const query = require('./query');
const helper = require('./helper');
const save = require('./save');
const update = require('./update');
const del = require('./delete');

module.exports = {

    init(hosts, auth, options) {
      return neo4j.init(hosts, auth, options);
    },

    plugin(identifier) {

      return (schema, config) => {
          schema.statics.cypherQuery = (...args) => query(neo4j.getDriver(identifier))(...args);

          // Save middleware
          schema.post('save', (doc, next) => save.one(schema, doc, next, neo4j.getDriver(identifier)));
          schema.post('insertMany', (docs, next) => save.multiple(schema, docs, next, neo4j.getDriver(identifier)));


          // Update functions
          schema.methods.updateNeo = function updateNeo(criteria, options, cb) {
            return update.one(schema, neo4j.getDriver(identifier), criteria, this, options, cb);
          };

          // Remove middleware
          schema.post('remove', (doc, next) => del.one(schema, doc, next, neo4j.getDriver(identifier)));
      };

    }
};
