# joi-tz - Joi Timezone Validation

[![npm version](https://badge.fury.io/js/joi-tz.svg)](https://badge.fury.io/js/joi-tz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/tjdavey/joi-tz/badge.svg)](https://coveralls.io/github/tjdavey/joi-tz)
[![Known Vulnerabilities](https://snyk.io/test/github/tjdavey/joi-tz/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tjdavey/joi-tz?targetFile=package.json)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftjdavey%2Fjoi-tz.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftjdavey%2Fjoi-tz?ref=badge_shield)

Provides a Joi rule to validate IANA timezone strings (eg. `Europe/London`, `America/New_York`, `Etc/GMT-8`) using [luxon](https://moment.github.io/luxon). 

Joi-tz supports and is tested against Joi 16.x or higher.

This project is forked from [joi-timezone](https://www.npmjs.com/package/joi-timezone) (unmaintained). That project remains functional for Joi 9.x-15.x.

## Installation:

**npm:** `npm install joi-tz`

**yarn:** `yarn add joi-tz`

## Usage

```js
import BaseJoi from 'joi';
import JoiTimezone from 'joi-tz';

const Joi = BaseJoi.extend(JoiTimezone);

Joi.timezone().validate('Australia/Darwin');
// returns {value: 'Australia/Darwin'}
```

### TypeScript

Type declarations are bundled with the package.

## Compatibility

This library is tested for compatibility, and contains peer dependencies with the following versions. 


| Version                                                        | @hapi/joi 16.x | joi 16.x | joi 17.x | Timezone Database                                       |
|----------------------------------------------------------------|----------------|----------|----------|---------------------------------------------------------|
| [5.0.2](https://github.com/tjdavey/joi-tz/releases/tag/v5.0.2) |                | ✅        | ✅        | [Luxon](https://moment.github.io/luxon) 3.7.x           |
| [5.0.1](https://github.com/tjdavey/joi-tz/releases/tag/v5.0.1) |                | ✅        | ✅        | [Luxon](https://moment.github.io/luxon) 3.5.x           |
| [5.0.0](https://github.com/tjdavey/joi-tz/releases/tag/v5.0.0) |                | ✅        | ✅        | [Luxon](https://moment.github.io/luxon) 3.4.x           | 
| [4.1.1](https://github.com/tjdavey/joi-tz/releases/tag/v4.1.1) |                | ✅        | ✅        | [Moment-Timezone](https://momentjs.com/timezone/) 0.5.x | 
| [4.1.0](https://github.com/tjdavey/joi-tz/releases/tag/v4.1.0) |                | ✅        | ✅        | [Moment-Timezone](https://momentjs.com/timezone/) 0.5.x |
| [4.0.2](https://github.com/tjdavey/joi-tz/releases/tag/v4.0.2) | ✅              |          |          | [Moment-Timezone](https://momentjs.com/timezone/) 0.5.x |

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ftjdavey%2Fjoi-tz.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Ftjdavey%2Fjoi-tz?ref=badge_large)
