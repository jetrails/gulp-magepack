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

### version:

This parameter represents your package's version and will be used within the _package.xml_ file. It must be of type `string` and is a **required** parameter. An example valid options object containing this parameter can be found below:

```js
{
	version: "1.0.0"
}
```

### template:

This parameter will define the base _package.xml_ template to use when populating the contents, version, date, and time nodes.  It must be of type `string` and is an **optional** parameter. While this parameter is optional, if it is passed, then the file must be present. An example valid options object containing this parameter can be found below:

```js
{
	version: "1.0.0",
	template: "package.xml"
}
```

### output:

If this parameter is present, then the _package.xml_ file that is generated within the stream will also be saved as a file with the specified name. It must be of type `string` and is an **optional** parameter. This parameter can be used alongside the _template_ parameter, this way your template stays up to date. An example valid options object containing this parameter can be found below:

```js
{
	version: "1.0.0",
	template: "package.xml",
	output: "package.xml"
}
```
