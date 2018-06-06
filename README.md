# gulp-magepack
> Automate Magento 1 extension packaging for gulp

![MIT License](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=for-the-badge)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-lightgrey.svg?style=for-the-badge)
![Travis CI](https://img.shields.io/travis/jetrails/gulp-magepack.svg?style=for-the-badge&colorB=9f9f9f)

## About

This gulp plugin was made for developers who use gulp as part of their build system when making Magento 1 extensions. Instead of generating a new _package.xml_ file from Magento Connect every time a new version of their extension is released, this plugin can update parts of their project's _package.xml_ file. The version, date, time, and content hashes are all updated automatically. Please note that the rest of the data in the _package.xml_ file is not generated, instead you can pass an already filled out _package.xml_ file as a template and this plugin will update the dynamic nodes.

## Install

```
npm i -D gulp-magepack
```

or install with suggested plugins:

```
npm i -D gulp-magepack gulp-gzip gulp-tar
```

## Usage

Below is a sample gulp file that uses [gulp-gzip](https://github.com/jstuckey/gulp-gzip) and [gulp-tar](https://github.com/sindresorhus/gulp-tar) with this plugin in order to package the generated _package.xml_ file based on the passed source files.

```javascript
const gulp = require ("gulp")
const gzip = require ("gulp-gzip")
const tar = require ("gulp-tar")
const magepack = require ("gulp-magepack")

const EXTENSION_NAMESPACE = "JetRails_Demo"
const EXTENSION_VERSION = "1.0.0"

gulp.task ( "package", () => {
	let options = {
		"template": "package.xml",
		"output": "package.xml",
		"version": EXTENSION_VERSION
	}
	gulp.src ([ "src/**/*" ])
		.pipe ( magepack ( options ) )
		.pipe ( tar (`${EXTENSION_NAMESPACE}-${EXTENSION_VERSION}`) )
		.pipe ( gzip ({ extension: "tgz" }) )
		.pipe ( gulp.dest ("dist") )
})
```

## Options

An options object will be passed to the plugin as shown in the example above. Below are all passable options:

- **REQUIRED** `version`: `String` that represents your package's version, i.e. `1.0.0`
- **OPTIONAL** `template`: `String` path to template _package.xml_ file to use as base. This is optional but if it is passed, then it must exist as an absolute or relative path.
- **OPTIONAL** `output`: `String` path, either relative or absolute, for the outputted _package.xml_ file. If this is not present, then no output file will be generated. And only a virtual _package.xml_ file will be added to the file stream.
