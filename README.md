# Mongo4J
[![Build Status](https://travis-ci.org/SvenWesterlaken/mongo4j.svg?branch=master)](https://travis-ci.org/SvenWesterlaken/mongo4j)
[![Coverage Status](https://coveralls.io/repos/github/SvenWesterlaken/mongo4j/badge.svg?branch=master)](https://coveralls.io/github/SvenWesterlaken/mongo4j?branch=master)
[![npm](https://img.shields.io/npm/v/mongo4j.svg)](https://www.npmjs.com/package/mongo4j)
[![node](https://img.shields.io/node/v/mongo4j.svg)](https://www.npmjs.com/package/mongo4j)
[![Greenkeeper badge](https://badges.greenkeeper.io/SvenWesterlaken/mongo4j.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm](https://img.shields.io/npm/dt/mongo4j.svg)](https://www.npmjs.com/package/mongo4j)

[![NPM](https://nodei.co/npm/mongo4j.png)](https://nodei.co/npm/mongo4j/)

> A [mongoose](http://mongoosejs.com/) plugin to automatically maintain nodes in [neo4j](https://neo4j.com/)
>
> _**Currently in development**_

## Table of contents
- [Installation](#installation)
- [Setup](#setup)
  - [Single driver](#single-driver)
  - [Multiple drivers](#multiple-drivers)
- [Saving](#saving)
- [Upcoming features & to-do-list](#upcoming-features--to-do-list)
- [Credits](#credits)

## Installation

Download and install the package with npm:
```bash
npm install -save mongo4j
```

## Setup

Before you use (require) mongo4j anywhere. **First initialize it with drivers.**

This creates the singleton pattern lifecycle of driver(s) stated by the [neo4j-driver library](https://github.com/neo4j/neo4j-javascript-driver#usage-examples).

Same options can be used as the official driver and there is the possibility of initializing multiple drivers in the beginning. Which should be **only one driver per neo4j database**.

Options can be found on the neo4j driver [documentation](https://neo4j.com/docs/api/javascript-driver/current/function/index.html#static-function-driver).

### Single driver

#### mongo4j.init(host, auth, options)
- `host` - Url to neo4j database. Defaults to `bolt://127.0.0.1`
- `auth` - Authentication parameters:
  - `user` - User for neo4j authentication. Defaults to `neo4j`
  - `pass` - Password for neo4j authentication. Defaults to `neo4j`
- `options` - Options for neo4j driver. These can be found in the [documentation](https://neo4j.com/docs/api/javascript-driver/current/function/index.html#static-function-driver).

```javascript
const mongo4j = require('mongo4j');

mongo4j.init('bolt://localhost', {user: 'neo4j', pass: 'neo4j'});
```

### Multiple drivers

#### mongo4j.init(hosts, auth, options)

- `hosts` - Array of hosts. A host in this case consists of:
  - `name` - Identifier to reference this specific driver. _(Must be a string)_ **Required**
  - `url` - Url to neo4j database. Defaults to `bolt://127.0.0.1`
  - `auth` - Authentication parameters:
    - `user` - User for neo4j authentication. Defaults to `neo4j`
    - `pass` - Password for neo4j authentication. Defaults to `neo4j`
  - `options` - Options for neo4j driver. These can be found in the [documentation](https://neo4j.com/docs/api/javascript-driver/current/function/index.html#static-function-driver).
- `auth` - Authentication parameters. _Will be overwritten by individual authentication set in hosts_:
  - `user` - User for neo4j authentication. Defaults to `neo4j`
  - `pass` - Password for neo4j authentication. Defaults to `neo4j`
- `options` - Options for neo4j driver. These can be found in the [documentation](https://neo4j.com/docs/api/javascript-driver/current/function/index.html#static-function-driver). _Will be overwritten by individual options set in hosts_

In the case of multiple drivers make sure you initialize every driver with an identifier (name) in string format for later re-use, otherwise an error will be thrown.

```javascript
const mongo4j = require('mongo4j');

mongo4j.init(
  [{
    name: 'testconnection1',
    url: 'bolt://127.0.0.1',
    auth: {
      user: 'neo4j',
      pass: 'neo4j'
    }
  }, {
    name: 'testconnection2',
    url: 'bolt://127.0.0.1'
  }]
);
```

Authentication can be specified as an second argument to use the same authentication for all drivers. Authentication set per host will override these global authentication settings.

The same goes for options. If you only want to use shared options, make sure you pass `null` as a second argument:

```javascript
const mongo4j = require('mongo4j');

mongo4j.init([host1, host2], null, {connectionPoolSize: 100});
```

## Saving

##### ***Todo***

## Upcoming features & to-do-list
This plugin is still in early development so not all features are yet implemented unfortunately.
I'm trying my best to finish these features as fast as possible.
This is also the reason there are only pre-releases yet.

#### To-do-list:

- **Automatic document updating** (_currently in progress_)
- Automatic deletion
- **Documentation** (_currently in progress_)
- **Tests** (_currently in progress_)
- Helper functions
- State hooks
- Plugin for subdocuments

## Credits

Big shoutout to [srfrnk](https://github.com/srfrnk) for creating the repo called [moneo](https://github.com/srfrnk/moneo).

After some digging through the code, I missed some functionality and saw that the old HTTP driver for neo4j was used.
I decided to rewrite the code with extra functionality and use the [new neo4j driver](https://github.com/neo4j/neo4j-javascript-driver) which uses the _'bolt'_ connection.

Moneo has provided me with the basic info to get started and mongo4j could be seen as a (continued) **version 2.0**.
