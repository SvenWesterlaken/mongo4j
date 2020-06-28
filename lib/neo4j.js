const neo4j = require('neo4j-driver');
const _ = require('lodash');

module.exports = {
  drivers: undefined,
  driver: undefined,

  init(hosts, auth, options) {
    // If there is an array specified, create an array of drivers (multiple databases case)
    if (_.isArray(hosts) && _.isNil(this.driver) && _.isNil(this.drivers)) {
      // Return mapped array of neo4j drivers and their name
      this.drivers = _.map(hosts, (host) => {
        // Name must be set to ensure you can select the right database
        if (_.isNil(host.name)) {
            throw new TypeError("Name of Neo4j-connection must be specified, if you have more than one");
        } else if (!_.isString(host.name)) {
            throw new TypeError("Name of Neo4j-connection must be a string");
        }

        const neo_url = host.url || 'neo4j://127.0.0.1';
        const neo_auth = host.auth || auth || { user: 'neo4j', pass: 'neo4j' };
        const neo_options = host.options || options || {};

        return {
          name: host.name,
          driver: neo4j.driver(neo_url, neo4j.auth.basic(neo_auth.user, neo_auth.pass), neo_options)
        };
      });

      return this.drivers;
    }

    // Create a new driver (single database case)
    if (_.isNil(this.driver) && _.isNil(this.drivers)) {
      const neo_url = hosts || 'neo4j://127.0.0.1';
      const neo_auth = auth || { user: 'neo4j', pass: 'neo4j' };
      const neo_options = options || {};

      this.driver = neo4j.driver(neo_url, neo4j.auth.basic(neo_auth.user, neo_auth.pass), neo_options);
      return this.driver;
    }

    if (!_.isNil(this.driver)) {
      throw new TypeError("A driver has already been initialized");
    } else if (!_.isNil(this.drivers)) {
      throw new TypeError("Drivers have already been initialized");
    }
  },

  getDriver(identifier) {

    if (!_.isNil(this.driver)) {
      return this.driver;
    }

    if (!_.isNil(this.drivers) && _.isNil(identifier)) {
      throw new TypeError("You initiated more than one driver, which means you need to provide an identifier (String or Integer)");
    }

    if (_.isString(identifier) && !_.isNil(this.drivers)) {
      return _.find(this.drivers, ['name', identifier]);
    }

    if (_.isInteger(identifier) && !_.isNil(this.drivers)) {

      if(identifier > this.drivers.length) {
        throw new RangeError("Identifier is greater than the length of the array of drivers");
      }

      if(identifier <= 0) {
        throw new RangeError("Identifier must be greater than 0");
      }

      return this.drivers[identifier - 1];
    }

    if (_.isNil(this.driver) && _.isNil(this.drivers)) {
      throw new TypeError("No drivers have yet been initialized, do so by calling: init()");
    }
  },

  close(identifier) {

    if (!_.isNil(this.drivers) && _.isBoolean(identifier) && identifier) {
      return Promise.all(_.map(this.drivers, (v) => v.driver.close()));
    }

    const d = this.getDriver(identifier);
    const driver = !_.isNil(this.drivers) ? d.driver : d;

    return driver.close();
  },

  reset() {
    if (!_.isNil(this.driver) || !_.isNil(this.drivers)) {
      return this.close(true).then(() => {
        this.driver = undefined;
        this.drivers = undefined;
      });
    } else {
      console.warn('Seems like you\'re resetting while the drivers are not set. This should not be the case if you don\'t know what you\'re doing.');
      this.driver = undefined;
      this.drivers = undefined;
      return Promise.resolve();
    }
  }
};
