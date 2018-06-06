const deasync = require ("deasync")
const fs = require ("fs")
const moment = require ("moment")
const path = require ("path")
const xml2js = require ("xml2js")
const xmlParser = xml2js.parseString
const XmlBuilder = xml2js.Builder

const XML_OPTIONS = {
	"renderOpts": {
		"indent": "\t",
		"newline": "\n",
		"pretty": true
	},
	"xmldec": {
		"version": "1.0"
	}
}

function loadTemplate ( templatePath ) {
	let defaultTemplate = {
		"package": {
			"date": null,
			"time": null,
			"version": null,
			"contents": null
		}
	}
	if ( typeof templatePath !== undefined && fs.existsSync ( templatePath ) ) {
		let contents = fs.readFileSync ( templatePath )
		let returnValue = defaultTemplate
		let wait = true
		xmlParser ( contents, ( error, result ) => {
			returnValue = error ? defaultTemplate : result
			wait = false
		})
		while ( wait ) { deasync.sleep ( 100 ) }
		return returnValue
	}
	else {
		return defaultTemplate
	}
}

function generate ( version, contents, templatePath, outputPath ) {
	let now = moment ()
	let date = now.format ("YYYY-MM-DD")
	let time = now.format ("HH:mm:ss")
	let data = loadTemplate ( templatePath )
	data.package.date = date
	data.package.time = time
	data.package.version = version
	data.package.contents = { target: contents }
	let dataString = new XmlBuilder ( XML_OPTIONS ).buildObject ( data )
	if ( typeof outputPath === "string" ) {
		fs.writeFileSync ( path.resolve ( outputPath ), dataString )
	}
	return dataString
}

module.exports = generate
