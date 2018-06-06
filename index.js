"use strict"

module.paths.push ( __dirname )

const fs = require ("fs")
const md5 = require ("md5")
const path = require ("path")
const through = require ("through2")
const vinyl = require ("vinyl")
const PluginError = require ("plugin-error")

const generateContents = require ("lib/generateContents")
const generatePackage = require ("lib/generatePackage")

const PLUGIN_NAME = "gulp-magepack"

function isObject ( value ) {
	return value && typeof value === "object" && value.constructor === Object
}

module.exports = ( options ) => {

	let hashes = {}
	let checked = false
	let valid = true

	let transform = function ( file, encoding, callback ) {
		if ( !checked ) {
			if ( !isObject ( options ) ) {
				valid = false
				let msg = "options object must be passed into the constructor"
				this.emit ( "error", new PluginError ( PLUGIN_NAME, msg ) )
			}
			else if ( !( "version" in options ) ) {
				valid = false
				let msg = "version option must be defined"
				this.emit ( "error", new PluginError ( PLUGIN_NAME, msg ) )
			}
			else if ( "template" in options && !fs.existsSync ( path.resolve ( options.template ) ) ) {
				valid = false
				let msg = "passed template file doesn't exist"
				this.emit ( "error", new PluginError ( PLUGIN_NAME, msg ) )
			}
			else {
				checked = true
			}
		}
		if ( checked && valid ) {
			// Collect file hashes and pass file down stream
			if ( file.isBuffer () ) {
				hashes [ file.relative ] = md5 ( file.contents )
			}
			callback ( null, file )
		}
	}

	let generate = function ( callback ) {
		let version = options.version
		let templatePath = "template" in options ? path.resolve ( options.template ) : undefined
		let outputPath = "output" in options ? path.resolve ( options.output ) : undefined
		// Generate package data
		let contents = generateContents ( hashes )
		let data = generatePackage ( version, contents, templatePath, outputPath )
		// Create virtual file stream
		let stream = new vinyl ({
			"path": "package.xml",
			"contents": new Buffer ( data )
		})
		// Pass virtual file down stream
		callback ( null, stream )
		this.emit ("end")
	}

	return through.obj ( transform, generate )

}
