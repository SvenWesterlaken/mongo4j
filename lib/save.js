const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, doc, next) {
    const neo_doc = node.convertToNeoModel(schema, doc);

    // let neo_cmd = 'MERGE';
    //
    // console.log(neo_cmd)

    next();
  },

  multiple(schema, docs, next) {
    // console.log(docs);
    next();
  },

}
