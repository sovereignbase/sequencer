# Changelog

## [1.3.4](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.3.3...v1.3.4) (2026-05-23)


### Performance Improvements

* overwrite scenario improvements in bench ([0a71894](https://github.com/sovereignbase/convergent-replicated-list/commit/0a71894f4816616bb34ddabff3c0e2ad959b0e4a))

## [1.3.3](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.3.2...v1.3.3) (2026-05-23)


### Bug Fixes

* handle tombstoned predecessor ordering in shuffled gossip ([cba5783](https://github.com/sovereignbase/convergent-replicated-list/commit/cba5783e4aade1155358b44e99c9d61dd46fb512))
* re-push with fingers crossed (maybe github actions work this time) ([0b212a4](https://github.com/sovereignbase/convergent-replicated-list/commit/0b212a4b8cf6e8434b2bc56e7e507ef9c27af0cf))


### Performance Improvements

* improve read speed ([b24b3f6](https://github.com/sovereignbase/convergent-replicated-list/commit/b24b3f67765833d0188c7349cda166678e8e63eb))

## [1.3.2](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.3.1...v1.3.2) (2026-05-23)


### Bug Fixes

* readme dep compat info ([641e808](https://github.com/sovereignbase/convergent-replicated-list/commit/641e808f066156471181cbc38bd476573cc939c3))

## [1.3.1](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.3.0...v1.3.1) (2026-05-23)


### Bug Fixes

* have to just get actions to re-run because github is big pile of .... ([bed377d](https://github.com/sovereignbase/convergent-replicated-list/commit/bed377d306e7ee9f19528caba6c57281bd4254a2))

## [1.3.0](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.2.1...v1.3.0) (2026-05-23)


### Features

* improve merge performance ([a16988c](https://github.com/sovereignbase/convergent-replicated-list/commit/a16988c1fa39b2f05cdbc90075f9fb8166880b59))


### Performance Improvements

* speed remote insert visibility ([e0e0a3b](https://github.com/sovereignbase/convergent-replicated-list/commit/e0e0a3b99087d20185b61beb98ecd1fa99591224))

## [1.2.1](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.2.0...v1.2.1) (2026-05-23)


### Bug Fixes

* snapshot hydration recursion error ([01a7de8](https://github.com/sovereignbase/convergent-replicated-list/commit/01a7de867bad66896e22db3ad6604bbcad8d3c6c))

## [1.2.0](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.1.0...v1.2.0) (2026-05-15)


### Features

* optimize ([9ec815a](https://github.com/sovereignbase/convergent-replicated-list/commit/9ec815a82089b1f029998e4b43541b07c7232a01))

## [1.1.0](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.9...v1.1.0) (2026-05-14)


### Features

* add find method to CRList class. ([b4ebd5f](https://github.com/sovereignbase/convergent-replicated-list/commit/b4ebd5ff2de2839910eab7129078a426ab77ac49))

## [1.0.9](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.8...v1.0.9) (2026-05-09)


### Bug Fixes

* bumbed dependencies. ([941aa48](https://github.com/sovereignbase/convergent-replicated-list/commit/941aa48d1ee30cd445c3ad01b976bed7fa14f0af))

## [1.0.8](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.7...v1.0.8) (2026-04-23)


### Bug Fixes

* bumbed dependencies. ([b855cbe](https://github.com/sovereignbase/convergent-replicated-list/commit/b855cbed1081706b71c41b78d2b553847013c697))

## [1.0.7](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.6...v1.0.7) (2026-04-16)


### Bug Fixes

* Removed problematic 'appendace of an already existing value to change event' in __merge relink path. ([a177786](https://github.com/sovereignbase/convergent-replicated-list/commit/a177786af4bff1e8d2ac8ebd74dcc3926e2a233f))

## [1.0.6](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.5...v1.0.6) (2026-04-16)


### Bug Fixes

* Removed stupid and useless AI written notation from readme. ([bf0a74a](https://github.com/sovereignbase/convergent-replicated-list/commit/bf0a74a0bfa223b0dee85ff74aa49a10f4526570))

## [1.0.5](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.4...v1.0.5) (2026-04-16)


### Bug Fixes

* Clarified documentation and other fixes. ([7cf90a5](https://github.com/sovereignbase/convergent-replicated-list/commit/7cf90a5507ec737c83668dfd6e872cad08f968ca))

## [1.0.4](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.3...v1.0.4) (2026-04-14)


### Bug Fixes

* added fixes and tests to ensure mutation safety of change event payloads. ([e6c547a](https://github.com/sovereignbase/convergent-replicated-list/commit/e6c547a01f82462dae8734eda57f20a43d5150b8))

## [1.0.3](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.2...v1.0.3) (2026-04-12)


### Bug Fixes

* Tiny details... ([7ecd6b5](https://github.com/sovereignbase/convergent-replicated-list/commit/7ecd6b59379f97d8b7127d8bd0caf4f85689a4d2))

## [1.0.2](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.1...v1.0.2) (2026-04-11)


### Bug Fixes

* returns copies instead so mutations to value reads do not corrupt replica. ([26f1107](https://github.com/sovereignbase/convergent-replicated-list/commit/26f1107d894f7815a19b4fa1a9d92c077c41464b))

## [1.0.1](https://github.com/sovereignbase/convergent-replicated-list/compare/v1.0.0...v1.0.1) (2026-04-11)


### Bug Fixes

* alinged type surface with other cr classes.. ([ffbd0ee](https://github.com/sovereignbase/convergent-replicated-list/commit/ffbd0eec50a6d9864a819f738a0d62dbb1802610))

## 1.0.0 (2026-04-09)


### Features

* First version! ([aac43d7](https://github.com/sovereignbase/convergent-replicated-list/commit/aac43d76bbc25257bfd0c3885240a3a11119f651))
* First version! ([f3228b0](https://github.com/sovereignbase/convergent-replicated-list/commit/f3228b0592521319b158a470705df8514a8b1ebf))

## Changelog

## version - date

- changes
