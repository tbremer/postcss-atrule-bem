# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased Change]
_None as of 2017-11-21._

## [3.1.1] - 2017-11-21
### Added
- `CHANGELOG.md`

## [3.1.0] - 2017-11-11
### Added
- support for shortcuts options
  - _example:_

  ```
  /* with shortcuts: true; as option */
  @b block {
    @e element {
      @m modifier {
      }
    }
  }

  /* generates */
  .block {}
  .block__element {}
  .block__element--modifier {}
  ```
- support for separators
  - default: `{ element: '_', modifier: '-' }`
  - _example:_

  ```
  /* with element set to `_` and modifier set to `-` */
  @b block {
    @e element {
      @m modifier {
      }
    }
  }

  /* generates */
  .block {}
  .block_element {}
  .block_element-modifier {}
  ```

### Changed
- Added Travis test for Node 8
- updated packages
- minor optimizations
- `package.json` description updates

## [3.0.1] - 2017-08-04
### Changed
- Update build steps for NPM `package.json` [prepublish](https://docs.npmjs.com/misc/scripts) [deprecation](http://blog.lholmquist.org/npm-prepublish-changes/)

## [3.0.0] - 2017-08-04
### Added
- Build step for CommonJS output

### Changed
- Update dependencies
- Fix long standing CommonJS require
  - To upgrade change `const atRuleBem = require('postcss-atrule-bem').default;` to `const atRuleBem = require('postcss-atrule-bem');`


## [2.1.3] - 2017-03-23
### Changed
- update `.npmignore` … again 👌

## [2.1.2] - 2017-03-23
### Changed
- update `.npmignore`

## [2.1.1] - 2017-03-23
### Changed
- Module entry for CommonJS requires

## [2.1.0] - 2017-03-23
### Added
- Allow multiple selectors per rule
  - _example:_
  ```
    @block one, two {
      prop: value;
    }

    /* generates */
    .one, .two {
      prop: value;
    }
    ```

## [2.0.1] - 2016-10-25
### Changed
- Update `package.json` description
- Update README badges to point to right repo 🐣

## [2.0.0] - 2016-10-24
### Added
- `strict` rule which disallows improperly formed components
- `warn` turns on warnings for said invalid components
- child node invalidation
- child node rule checking

## [1.0.1] - 2016-10-17
### Changed
- update `package.json` with proper description

## [1.0.0] - 2016-10-17
- First published!

---

_The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)._
