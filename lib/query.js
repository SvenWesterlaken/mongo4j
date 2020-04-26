const parser = require('parse-neo4j');
const _ = require('lodash');

module.exports = (driver) => {

  return (query, params, options) => {

    // Query must be of type string
    if (!_.isString(query)) {
      throw new TypeError('Cypher query must be a string.');
    }

    // Set second argument to options if needed
    if (_.has(params, 'parse') || _.has(params, 'sub')) {
      options = params;
      params = undefined;
    }

    options = options || {};
    options.sub = options.sub || false;
    options.parse = options.parse || false;


    if (options.parse && options.sub) {
      throw new TypeError('Parsing is only possible in case of a Promise, with a subscription you will need to do it manually.');
    }

    const session = driver.session();
    let result = _.isNil(params) ? session.run(query) : session.run(query, params);

    // Possibility for subscription will be returned
    if (options.sub) {
      return result;
    }

    return result.then((r) => session.close().then(() => r)).then((result) => {
      result = options.parse ? parser.parse(result) : result;
      return result.length == 1 ? result[0] : result;
    });
  };
};
