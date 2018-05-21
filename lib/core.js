const mongoose = require('mongoose');
const neo4j = require('./neo4j');
const query = require('./query');
const helper = require('./helper');
const save = require('./save');

module.exports = {

    init(hosts, auth, options) {
      return neo4j.init(hosts, auth, options);
    },

    plugin(identifier) {

      return (schema, config) => {
          let driver = neo4j.getDriver(identifier);

          schema.static('cypherQuery', query(driver));

          schema.post('save', (doc, next) => save.one(schema, doc, next, driver));
          schema.post('insertMany', (docs, next) => save.multiple(schema, docs, next, driver));
      }

    }



}
