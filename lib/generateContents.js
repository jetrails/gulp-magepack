const path = require ("path")

const INITIAL_MAPPINGS = {
	"magelocal": "app/code/local/",
	"magecommunity": "app/code/community/",
	"magecore": "app/code/core/",
	"magedesign": "app/design/",
	"mageetc": "app/etc/",
	"magelib": "lib/",
	"magelocale": "app/locale/",
	"magemedia": "media/",
	"mageskin": "skin/",
	"magetest": "tests/",
	// "mageweb": "",
	"other": ""
}

let createParentNode = ( name ) => {
	return {
		"$": {
			"name": name
		},
		"file": [],
		"dir": []
	}
}

let createFile = ( name, hash ) => {
	return {
		"$": {
			"name": name,
			"hash": hash
		}
	}
}

function build ( mappings, paths, hashes, base = "" ) {
 	// Initialize collection array that will be returned
 	let collection = []
 	// Base case, if there are no files
 	if ( paths.length == 0 ) return []
 	// Seperate files from paths and append to collection array
	let files = paths.filter ( p => p.indexOf ("/") < 0 )
	paths = paths.filter ( p => files.indexOf ("/") < 0 )
	for ( let f in files ) {
		let file = files [ f ]
		let hash = hashes [ path.join ( base, file ) ]
		collection.push ( createFile ( files [ f ], hash ) )
	}
 	// Build recursive directory tree
 	for ( let m in mappings ) {
 		// Based on the passed type, construct node
 		let mapping = mappings [ m ]
 		let node = createParentNode ( m )
 		// Based on current mapping, collect all matching paths
 		let matchesFound = paths.filter ( file => file.startsWith ( mapping ) )
 		matches = matchesFound.map ( match => match.substr ( mapping.length ) )
 		paths = paths.filter ( p => matchesFound.indexOf ( p ) < 0 )
 		// If there are any mappings, then recursively collect them
 		if ( matches.length > 0 ) {
 			// Based on matches, construct new mappings
 			let dirNames = []
 			for ( let i in matches ) {
 				let match = matches [ i ]
 				let dirName = match.substr ( 0, match.indexOf ("/") )
 				dirNames [ dirName ] = dirName + "/"
 			}
 			// Recursively collect all possible nodes and add to collection
 			let recursive = build ( dirNames, matches, hashes, path.join ( base, mapping ) )
 			node.dir = node.dir.concat ( recursive )
 			collection.push ( node )
 		}
 	}
 	// Return the collection of nodes
 	return collection
}

function generate ( hashes ) {
	let files = Object.keys ( hashes )
 	return build ( INITIAL_MAPPINGS, files, hashes )
}

module.exports = generate
