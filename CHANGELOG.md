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
