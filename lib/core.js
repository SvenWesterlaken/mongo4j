const mongoose = require('mongoose');
const neo4j = require('./neo4j');
const query = require('./query');

module.exports = {

    init(hosts, auth, options) {
      return neo4j.init(hosts, auth, options)
    },

    plugin(identifier) {

      return (schema, config) => {
          let driver = neo4j.getDriver(identifier);

          schema.add({_neo4j: {type: Boolean, default: false}});
          schema.static('cypherQuery', query(driver));

          schema.pre('save', (next) => {
              this._neo4j = true;
              next();
          });

          // schema.post('save', (next) => {
          //
          // });
      }

    }



}
