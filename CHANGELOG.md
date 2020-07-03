## [3.0.1](https://github.com/SvenWesterlaken/mongo4j/compare/v3.0.0...v3.0.1) (2020-07-03)


### Bug Fixes

* upgrade mongoose from 5.9.20 to 5.9.21 ([64fed8d](https://github.com/SvenWesterlaken/mongo4j/commit/64fed8d0651ec6c3215e4337f36844435e1ced83))

# [3.0.0](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.5...v3.0.0) (2020-06-28)


### Bug Fixes

* **neo4j:** replace bolt with neo4j protocol ([84ca79a](https://github.com/SvenWesterlaken/mongo4j/commit/84ca79a301e3cf0cadb3333289a1f8643edff771))
* **test:** add longer timeout for hook ([4447ed6](https://github.com/SvenWesterlaken/mongo4j/commit/4447ed62b849853dd76a321fbee3340b29aadb62))
* **travis:** add initial password set ([30b7a78](https://github.com/SvenWesterlaken/mongo4j/commit/30b7a78994d8eae4f9c8325b82ebb67f5e6955c7))
* **travis:** add longer sleeping ([ac85c8c](https://github.com/SvenWesterlaken/mongo4j/commit/ac85c8ca8a1a3d7fa37994d64fed7aba00c63d69))
* **travis:** add openjdk11 ([3a87444](https://github.com/SvenWesterlaken/mongo4j/commit/3a8744488a394351dc5c5abf70fd400c4ed79298))
* **travis:** add oracle jdk for neo4j ([b30761e](https://github.com/SvenWesterlaken/mongo4j/commit/b30761ec3ee7b2a652292a097abce2250ff37262))
* **travis:** add post request to fix password bug ([15f383f](https://github.com/SvenWesterlaken/mongo4j/commit/15f383f8061fd708db3086f0b2354281dee212c2))
* **travis:** apply curl and remove sed cmd ([f587596](https://github.com/SvenWesterlaken/mongo4j/commit/f587596baf63d4d39ac6012bb02f279d4a59c24b))
* **travis:** apply jdk switcher ([48f3039](https://github.com/SvenWesterlaken/mongo4j/commit/48f3039a5da266d7ee3ba747b6a42831f017dc89))
* **travis:** comment out trusty ([ea690a8](https://github.com/SvenWesterlaken/mongo4j/commit/ea690a849b2d6030c268c8eedef7848cb72a096a))
* **travis:** create tmp folder for neo4j installation ([eee9586](https://github.com/SvenWesterlaken/mongo4j/commit/eee9586f56a23111b15ab41430394e8c54b485da))
* **travis:** move env to travis web instead of config file ([69d3e64](https://github.com/SvenWesterlaken/mongo4j/commit/69d3e6481eab27ceccb2747111108e819fccd00f))
* **travis:** remove jdk_switcher ([91ce10a](https://github.com/SvenWesterlaken/mongo4j/commit/91ce10a6f56bf73ef62431cde92994cd94be509b))
* **travis:** set jdk version to 11 ([a410874](https://github.com/SvenWesterlaken/mongo4j/commit/a410874043c3bbeea639898b1b4ec44bb75ae5e6))
* **travis:** try installing neo4j version 4.1.0 ([5afa876](https://github.com/SvenWesterlaken/mongo4j/commit/5afa8765ac6c83c2cf9e704bb36238fd5777edf1))
* **travis:** try to set neo4j version ([c356352](https://github.com/SvenWesterlaken/mongo4j/commit/c356352b38eef3d47b6622643693c62d5f6ab466))
* **travis:** use AUTH env variable ([a7808df](https://github.com/SvenWesterlaken/mongo4j/commit/a7808df52f16d78b1af0dc72fcaa0c3411e68830))
* upgrade mongoose from 5.9.18 to 5.9.20 ([641a049](https://github.com/SvenWesterlaken/mongo4j/commit/641a0494e8045e4126fda5025fdc484886b40f80))
* upgrade neo4j-driver from 4.0.2 to 4.1.0 ([85a14c7](https://github.com/SvenWesterlaken/mongo4j/commit/85a14c791493c630980fbe12bd9b64318b7612aa))


### doc

* **README:** update documentation to changes ([9edf356](https://github.com/SvenWesterlaken/mongo4j/commit/9edf356f8375bf5450a3fa4635556020a524d408))


### BREAKING CHANGES

* **README:** use neo4j as a standard protocol instead of bolt
* **README:** now tested with neo4j database version >= 4
* **README:** old parameter syntax is deprecated, new usage in documentation

## [2.1.5](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.4...v2.1.5) (2020-06-24)


### Bug Fixes

* upgrade mongoose from 5.9.14 to 5.9.18 ([13c8615](https://github.com/SvenWesterlaken/mongo4j/commit/13c86159673150073d76d441c2235954b2b5ce5d))

## [2.1.4](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.3...v2.1.4) (2020-06-13)


### Bug Fixes

* upgrade mongoose from 5.9.13 to 5.9.14 ([1fd5a94](https://github.com/SvenWesterlaken/mongo4j/commit/1fd5a941f5903f18c0c1158635e56ad0fadad035))
* upgrade mongoose from 5.9.13 to 5.9.14 ([ceb914e](https://github.com/SvenWesterlaken/mongo4j/commit/ceb914e0c5e0430529227f562f693e531e6439ba))

## [2.1.3](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.2...v2.1.3) (2020-05-14)


### Bug Fixes

* upgrade mongoose from 5.9.12 to 5.9.13 ([a9337c4](https://github.com/SvenWesterlaken/mongo4j/commit/a9337c4984ec650e696d0b9426c8017cc114eab0))
* upgrade mongoose from 5.9.12 to 5.9.13 ([870f6d7](https://github.com/SvenWesterlaken/mongo4j/commit/870f6d784119abd360fcc2541d06fa66169f395c))

## [2.1.2](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.1...v2.1.2) (2020-05-07)


### Bug Fixes

* upgrade mongoose from 5.9.10 to 5.9.12 ([090a575](https://github.com/SvenWesterlaken/mongo4j/commit/090a575d32a76773853f058cc11433055e2ee697))
* upgrade mongoose from 5.9.10 to 5.9.12 ([272032d](https://github.com/SvenWesterlaken/mongo4j/commit/272032dd76f099fbcb8dea9c4c494cb33bd30a16))

## [2.1.1](https://github.com/SvenWesterlaken/mongo4j/compare/v2.1.0...v2.1.1) (2020-04-28)

# [2.1.0](https://github.com/SvenWesterlaken/mongo4j/compare/v2.0.0...v2.1.0) (2020-04-26)


### Bug Fixes

* **neo4j:** refactor & fix neo4j driver access & closing ([dbf59eb](https://github.com/SvenWesterlaken/mongo4j/commit/dbf59eb290afbd98be3b1622ce81629fcade6007))


### Features

* **core:** make driver management available from core ([a875d21](https://github.com/SvenWesterlaken/mongo4j/commit/a875d216653fada04e75c6ae92c5d765efbb0a34))
* **neo4j:** add extra logic & checking for closing all drivers at once ([f71abf3](https://github.com/SvenWesterlaken/mongo4j/commit/f71abf388c9a160f0918a13d30cf307dd060ec38))

# [2.0.0](https://github.com/SvenWesterlaken/mongo4j/compare/v1.0.0...v2.0.0) (2020-04-24)


### Bug Fixes

* **neo4j:** add handling for promisified closing ([b248bd4](https://github.com/SvenWesterlaken/mongo4j/commit/b248bd41d77224e0fcc1c656b17724018ee26ad6))
* **npm:** add readme doc update as patch release ([8eb3166](https://github.com/SvenWesterlaken/mongo4j/commit/8eb31661fa6735ece0e6a4532501b4af555ceef5))
* **package:** update coveralls & remove unused mocha-mongo ([1c9f5e1](https://github.com/SvenWesterlaken/mongo4j/commit/1c9f5e1c728c8e261248389606f65a8fda0d559b))
* **packages:** update packages to newest compatible versions ([33fbfff](https://github.com/SvenWesterlaken/mongo4j/commit/33fbfffbe25a26e401ce3e144ba94a7dbd851688))
* **travis:** add back caching ([887ab26](https://github.com/SvenWesterlaken/mongo4j/commit/887ab2612b2d1b11fe6e2c2de5bba4241e5480a8))


### BREAKING CHANGES

* **neo4j:** closing a `session.close()` or `neo4j.close()` now always returns a Promise.
* **neo4j:** requires node 10

# [1.0.0](https://github.com/SvenWesterlaken/mongo4j/compare/v0.4.1...v1.0.0) (2020-04-24)


### Bug Fixes

* **travis:** remove cache ([5f13dd6](https://github.com/SvenWesterlaken/mongo4j/commit/5f13dd6))

## [0.4.1](https://github.com/SvenWesterlaken/mongo4j/compare/v0.4.0...v0.4.1) (2019-03-21)

# [0.4.0](https://github.com/SvenWesterlaken/mongo4j/compare/v0.3.0...v0.4.0) (2019-03-15)


### Features

* **delete:** add automatic deletion for remove() ([91033fa](https://github.com/SvenWesterlaken/mongo4j/commit/91033fa))

# [0.3.0](https://github.com/SvenWesterlaken/mongo4j/compare/v0.2.2...v0.3.0) (2019-02-05)


### Bug Fixes

* **mongoose:** update methods to new names ([72081e7](https://github.com/SvenWesterlaken/mongo4j/commit/72081e7))
* **travis:** fix neo4j download error ([750775a](https://github.com/SvenWesterlaken/mongo4j/commit/750775a))
* **travis:** update install script to prevent synchronization error ([9adb81a](https://github.com/SvenWesterlaken/mongo4j/commit/9adb81a))


### Features

* **update:** add automatic updating of nodes ([f5b9246](https://github.com/SvenWesterlaken/mongo4j/commit/f5b9246))
* **update:** update multiple document references ([975a898](https://github.com/SvenWesterlaken/mongo4j/commit/975a898))
* **update:** update properties of nested document references ([bead0ff](https://github.com/SvenWesterlaken/mongo4j/commit/bead0ff))
* **update:** update relationship ([934b4bb](https://github.com/SvenWesterlaken/mongo4j/commit/934b4bb))

## [0.2.2](https://github.com/SvenWesterlaken/mongo4j/compare/v0.2.1...v0.2.2) (2018-09-23)


### Bug Fixes

* **package:** regenerate package-lock.json ([782b8b2](https://github.com/SvenWesterlaken/mongo4j/commit/782b8b2))
* **package:** resolve conflicts ([2c685c1](https://github.com/SvenWesterlaken/mongo4j/commit/2c685c1))

<a name="0.2.1"></a>
## [0.2.1](https://github.com/SvenWesterlaken/mongo4j/compare/v0.2.0...v0.2.1) (2018-07-04)

<a name="0.2.0"></a>
# [0.2.0](https://github.com/SvenWesterlaken/mongo4j/compare/v0.1.2...v0.2.0) (2018-05-21)


### Bug Fixes

* **neo4j-save:** keep session open ([7051c19](https://github.com/SvenWesterlaken/mongo4j/commit/7051c19))


### Features

* **save:** add saving feature ([0f6c0f3](https://github.com/SvenWesterlaken/mongo4j/commit/0f6c0f3))

<a name="0.1.2"></a>
## [0.1.2](https://github.com/SvenWesterlaken/mongo4j/compare/v0.1.1...v0.1.2) (2018-05-08)


### Bug Fixes

* **package:** update neo4j-driver to version 1.6.1 ([6e59ca5](https://github.com/SvenWesterlaken/mongo4j/commit/6e59ca5))

<a name="0.1.1"></a>
## 0.1.1 (2018-03-24)


### Bug Fixes

* **travis:** quick travis fix ([9c12dc5](https://github.com/SvenWesterlaken/mongo4j/commit/9c12dc5))
* **travis:** run cover as script ([746b85f](https://github.com/SvenWesterlaken/mongo4j/commit/746b85f))
* **travis:** update package scripts ([5d5ee03](https://github.com/SvenWesterlaken/mongo4j/commit/5d5ee03))


### Features

* **travis:** add travis.yml ([d51e70c](https://github.com/SvenWesterlaken/mongo4j/commit/d51e70c))
