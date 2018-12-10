var Jogo = require("./src/jogo/jogo");

function getContent( argv ) {
	var filepath = argv[ 2 ];
	var isURL = filepath.indexOf( "http" ) !== -1;
	if ( isURL ) {

	} else {
		let fs = require( "fs" );
		if ( !fs.existsSync( filepath ) ) {
			console.log( "The path is incorrect: ", filepath );
			return 1;
		}
		content = fs.readFileSync( filepath, "utf8" );
	}
	try {
		var isValidJSON = JSON.parse( content );
		return content;
	} catch( e ) {
		console.log( "invalid json", e );
	}
	return false;
}

function showWelcome() {
	console.log( "Welcome to Jogo" );
	console.log( "Your favorite JSON to go Struct converter" );
	console.log( "provide a file name or URL as your arguments" );
	console.log( "" );
	console.log( "Here is an example of what will be produced:" );
	var j = `{"hello":"world"}`;
	console.log( "input: ", j);
	console.log( "output: ");
	console.log( "" );
	var conv = Jogo.convert( "Auto", j );
	for (var i = 0; i < conv.length; i++ ) {
		console.log( conv[ i ] );
	}
}

function init( argv, argc ) {
	if ( argc < 3 ) {
		showWelcome();
		return 0;
	}
	var content = getContent( argv );
	var results = Jogo.convert( "AutoGenerated", content );
	for( var i = 0; i < results.length; i++ ) {
		console.log( results[ i ], "\n" );
	}
}

Jogo.opts.tabChar = "    ";
init( process.argv, process.argv.length );
