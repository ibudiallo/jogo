var Jogo = require("./src/jogo/jogo");

Jogo.opts.tabChar = "    ";
//Jogo.opts.newLine = "\r\n";
//process.stdout.write(conv);
var argv = process.argv;
var argc = argv.length;;

if ( argc < 3 ) {
	console.log( "Welcome to Jogo" );
	console.log( "Your favorite JSON to go Struct converter" );
	console.log( "provide a file name or URL as your arguments" );
	console.log( "" );
	console.log( "Here is an example of what will be produced:" );
	var j = `{"hello":"world"}`;
	console.log( "input: ", j);
	console.log( "output: ");
	console.log( "" );
	var conv = Jogo.convert("Auto",j);
	for (var i = 0; i < conv.length; i++ ) {
		console.log( conv[ i ]);
	}

}
