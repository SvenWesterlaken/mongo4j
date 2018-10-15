const mongoose = require('mongoose');
const neo4j = require('./neo4j');
const query = require('./query');
const helper = require('./helper');
const save = require('./save');
const update = require('./update');

module.exports = {

    init(hosts, auth, options) {
      return neo4j.init(hosts, auth, options);
    },

    plugin(identifier) {

      return (schema, config) => {
          let driver = neo4j.getDriver(identifier);

          schema.static('cypherQuery', query(driver));

          //Save middleware
          schema.post('save', (doc, next) => save.one(schema, doc, next, driver));
          schema.post('insertMany', (docs, next) => save.multiple(schema, docs, next, driver));

          //Update functions

          schema.methods.updateNeo = function updateNeo(criteria, options, cb) {
            return update.updateFull(schema, driver, criteria, this, options, cb);
          };

      };

    }
};
