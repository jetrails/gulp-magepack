const assert = require ("chai").assert
const es = require ("event-stream")
const expect = require ("chai").expect
const File = require ("vinyl")
const fs = require ("fs")
const gulp = require ("gulp")
const magepack = require ("../index.js")
const md5File = require ("md5-file")
const xmlParser = require ("xml2js").parseString

describe ( "testing options", () => {
	it ( "should throw type error when no options object is passed", () => {
		let expected = "options object must be passed into the constructor"
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack () )
			.on ( "error", ( e ) => expect ( e.message ).to.equal ( expected ) )
			.on ( "end", () => assert ( false ) )
	})
	it ( "should emit an error when empty options object is passed", () => {
		let expected = "version option must be defined"
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ({}) )
			.on ( "error", ( e ) => expect ( e.message ).to.equal ( expected ) )
			.on ( "end", () => assert ( false ) )
	})
	it ( "should finish when version string is passed", () => {
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ({ version: "1.0.0" }) )
			.on ( "error", ( e ) => assert ( false ) )
			.on ( "end", () => assert ( true ) )
	})
	it ( "should emit an error when template file doesn't exist", () => {
		let expected = "passed template file doesn't exist"
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ({ version: "1.0.0", template: "foo.xml" }) )
			.on ( "error", ( e ) => expect ( e.message ).to.equal ( expected ) )
			.on ( "end", () => assert ( false ) )
	})
	it ( "should finish if version and template file exists", () => {
		let expected = "passed template file doesn't exist"
		let options = { version: "1.0.0", template: "test/assets/package.xml" }
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ( options ) )
			.on ( "error", ( e ) => assert ( false ) )
			.on ( "end", () => assert ( true ) )
	})
	it ( "should output file when output is defined", () => {
		let expected = "passed template file doesn't exist"
		let options = {
			version: "1.0.0",
			template: "test/assets/package.xml",
			output: "test/assets/output.xml"
		}
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ( options ) )
			.on ( "error", ( e ) => assert ( false ) )
			.on ( "end", () => {
				if ( fs.existsSync ("test/assets/output.xml") ) {
					fs.unlinkSync ("test/assets/output.xml")
				}
				else {
					assert ( false )
				}
			})
	})
})

describe ( "testing package.xml file", () => {
	it ( "should match the file hash of fake file", ( done ) => {
		let target = "test/assets/src/app/code/community/JetRails/Demo/etc/adminhtml.xml"
		let hash = md5File.sync ( target )
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ({ version: "1.0.0" }) )
			.on ( "data", ( data ) => {
				if ( data.path === "package.xml" ) {
					xmlParser ( data.contents, ( error, result ) => {
						if ( error ) assert ( false )
						let file = result.package.contents [0].target [0]
							.dir [0].dir [0].dir [0].dir [0].$
						assert.equal ( file.hash, hash )
						assert.equal ( file.name, "adminhtml.xml" )
						done ()
					})
				}
			})
	})
	it ( "should match source path structure", ( done ) => {
		let options = { version: "8.0.0" }
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ( options ) )
			.on ( "data", ( data ) => {
				if ( data.path === "package.xml" ) {
					xmlParser ( data.contents, ( error, result ) => {
						if ( error ) assert ( false )
						var target = result.package.contents [0].target [0]
						assert.equal ( target.$.name, "magecommunity" )
						target = target.dir [0]
						assert.equal ( target.$.name, "JetRails" )
						target = target.dir [0]
						assert.equal ( target.$.name, "Demo" )
						target = target.dir [0]
						assert.equal ( target.$.name, "etc" )
						done ()
					})
				}
			})
	})
	it ( "contents of template should be preserved", ( done ) => {
		let options = { version: "8.0.0", template: "test/assets/package.xml" }
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ( options ) )
			.on ( "data", ( data ) => {
				if ( data.path === "package.xml" ) {
					xmlParser ( data.contents, ( error, result ) => {
						if ( error ) assert ( false )
						let xml = result.package
						assert.equal ( xml.other, "123" )
						done ()
					})
				}
			})
	})
	it ( "should contain new version", ( done ) => {
		gulp.src ( [ "test/assets/src/**/*" ] )
			.pipe ( magepack ({ version: "8.0.0" }) )
			.on ( "data", ( data ) => {
				if ( data.path === "package.xml" ) {
					xmlParser ( data.contents, ( error, result ) => {
						if ( error ) assert ( false )
						let xml = result.package
						assert.equal ( xml.version, "8.0.0" )
						done ()
					})
				}
			})
	})
})
