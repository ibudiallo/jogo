(function ( ) {
var root = this;

function getXMLParser() {
	return new DOMParser();
}

let Jogo = {
	goKeys: [ "API", "ASCII", "CPU", "CSS", "DNS", "EOF", "GUID", "HTML", "HTTP",
			"HTTPS", "ID", "IP", "JSON", "LHS", "QPS", "RAM", "RHS", "RPC", "SLA",
			"SMTP", "SSH", "TCP", "TLS", "TTL", "UDP", "UI", "UID", "UUID", "URI",
			"URL", "UTF8", "VM", "XML", "XSRF", "XSS" ],
	supportedMode: [ "json" ],
	obj: null,
	container: [],
	opts: {
		tabChar: "\t",
		annotation: true,
		omitempty: true,
		newLine: "\n",
		mode: "json",
	},

	init: function( opts ) {
		this.setOpts( opts );
	},

	setOpts: function( opts ) {
		if ( !opts ) {
			return;
		}
		for ( let i in opts ) {
			if ( opts.hasOwnProperty( i ) ){
				this.opts[i] = opts[i];
			}
		}
	},

	convert: function( varname, str ) {
		let error;
		let name = this.formatVarName( varname );
		try {
			JSON.parse(str);
			this.opts.mode = "json";
			return this.convertJSON( name, str );
		} catch( e ) {
			error = "error: " + e.message;
		}
		try {
			let x = getXMLParser();
			x.parseFromString( str, "text/xml" );
			this.opts.mode = "xml";
			return this.convertXML( name, str );
		} catch( e ) {
			error = "\n" + e.message;
		}
		console.log( "failed: ", error );
		return [];
	},

	convertXML: function( varname, xmlStr ) {
		this.container = [];
		let x = getXMLParser();
		var obj = x.parseFromString( xmlStr, "text/xml" );
		this.processXML( obj, varname );
		return this.getContainers();
	},

	convertJSON: function( name, jsonStr ){
		this.container = [];
		var obj = null;
		try {
			obj = JSON.parse( jsonStr );
		}catch( e ) {
			console.log( "invalid json: " + e );
			return false;
		}
		this.process( obj, name )
		return this.getContainers();
	},

	formatVarName: function( varname ) {
		var name = varname.replace( /[^\w]+/g , "" ).trim();
		if ( name.length < 2 ){
			name = "AutoGenerated";
		}
		return name;
	},

	process: function( obj, name ) {
		var contentName = "Content-" + Math.random(),
			strOut = ("type {} struct {" + this.opts.newLine + "{" + contentName + "}" + this.opts.newLine + "}" ).replace( "{}" , name ),
			hash = this.getObjHash( obj );
		var data = this.processObject( obj, name, 1 );
		strOut = strOut.replace( "{" + contentName + "}", data.join( this.opts.newLine ) );
		let total = this.addToContainer( name, strOut, hash );
	},

	processXML: function( obj, name ) {
		let contentName = "Content-" + Math.random(),
			strOut = ("type {} struct {" + this.opts.newLine + "{" + contentName + "}" + this.opts.newLine + "}" ).replace( "{}" , name ),
			hash = this.getObjHash( obj );
		let line1 = "XMLName xml.Name `xml:\"" + obj.children[ 0 ].nodeName + "\"`";
		let data = this.processXMLObject( obj.children[ 0 ], name, 1 );
		let resp = this.getTabs( 1 ) + line1 + this.opts.newLine + data.join( this.opts.newLine );
		strOut = strOut.replace( "{" + contentName + "}", data.join( this.opts.newLine ) );
		let total = this.addToContainer( name, strOut, hash );
	},

	processObject : function( obj, key, depth ) {
		let content = [];
		for ( let key in obj ) {
			let elem = obj[ key ];
			let type = this.getType( elem );
			let out = "";
			let keyName = this.formatName( key );
			if ( type === "array" ) {
				out = this.processArray( elem, key, depth );
				content.push( out );
				continue;
			}
			if ( type === "interface{}" ) {
				let tabs = this.getTabs( depth );
				if ( this.isEmptyObj( elem ) ) {
					content.push( this.getTabs( depth ) + keyName + " interface{} " + this.annotate( key ) );
					continue;
				}
				let objContentName = "Content-" + Math.random();
				let objOut = tabs + keyName + " struct {" + this.opts.newLine + objContentName + this.opts.newLine + tabs + "} " + this.annotate( key );
				let data = this.processObject( elem, key, depth + 1 );
				out = objOut.replace( objContentName, data.join( this.opts.newLine ) );
				content.push( out );
				continue;
			}
			out += this.getTabs( depth ) + keyName + " "+ type + " " + this.annotate( key );
			content.push( out );
		}
		return content;
	},

	processXMLObject : function( obj, key, depth ) {
		let content = [];
		for ( let i = 0, l = obj.children.length; i < l; i++ ) {
			let elem = obj.children[ i ];
			let key = elem.nodeName;
			let value = elem.textContent.trim();
			let type = this.getXMLType( elem );
			let out = "";
			let keyName = this.formatName( key );
			if ( type === "object" ) {
				let objContentName = "Content-" + Math.random();
				out = keyName + " struct {" + objContentName + "}";
				let s = this.processXMLObject( elem, key, depth + 1 );
				out = out.replace( objContentName, this.opts.newLine + s.join( "\n" ) + this.opts.newLine );
				content.push( out );
				continue;
			}
			if ( type === "interface{}" ) {
				let tabs = this.getTabs( depth );
				if ( this.isEmptyObj( elem ) ) {
					content.push( this.getTabs( depth ) + keyName + " interface{} " + this.annotate( key ) );
					continue;
				}
				let objContentName = "Content-" + Math.random();
				let objOut = tabs + keyName + " struct {" + this.opts.newLine + objContentName + this.opts.newLine + tabs + "} " + this.annotate( key );
				let data = this.processObject( elem, key, depth + 1 );
				out = objOut.replace( objContentName, data.join( this.opts.newLine ) );
				content.push( out );
				continue;
			}
			if ( type === "attr" ) {
				let objContentName = "Content-" + Math.random();
				let out = keyName + " struct {" + this.opts.newLine + objContentName + this.opts.newLine + "} " + this.annotate( key );
				let res = [];
				res.push( this.getTabs( depth + 1 ) + "Text string"  );
				for ( let j = 0; j < elem.attributes.length; j++ ) {
					let attr = elem.attributes[ j ];
					let val = attr.value;
					let k = attr.name;
					res.push( this.getTabs( depth + 1 ) + this.formatName ( k ) + " " + this.getType( val )  );
				}
				out = out.replace( objContentName, res.join( this.opts.newLine ) );
				content.push( out );
			}
			out += this.getTabs( depth ) + keyName + " "+ type + " " + this.annotate( key );
			content.push( out );
		}
		return content;
	},

	processArray : function( arr, key, depth ) {
		if ( this.getType( arr ) !== "array" ) {
			return this.getTabs( depth ) + this.getType( arr );
		}
		let keyName = this.formatName( key )
		let annot = this.annotate( key );
		if ( arr.length < 1 ) {
			return this.getTabs( depth ) + keyName +" []interface{} " + annot
		}
		let first = arr[ 0 ];
		let t = this.getType( first );
		if ( t === "array" ) {
			return this.processArrayList( first, key, depth );
		}
		if ( t === "interface{}" ) {
			return this.processArrayObject( first, key, depth );
		}
		return this.getTabs( depth ) + keyName + " []" + t + " " + annot;
	},

	processArrayList: function( list, key, depth ){
		let keyName = this.formatName( key );
		let annot = this.annotate( key );
		if ( list.length === 0 ) {
			return  this.getTabs( depth ) + keyName + " []interface{} " + annot;
		}
		let cName = "Content-" + Math.random();
		let out = this.getTabs( depth ) + keyName +" []struct {" + this.opts.newLine + cName + this.opts.newLine + this.getTabs( depth ) + "} " + annot;
		let data = this.processArray( list[ 0 ], "", depth + 1 );
		out = out.replace( cName, data );
		return out;
	},

	processArrayObject: function( obj, key, depth ) {
		let keyName = this.formatName( key );
		let annot = this.annotate( key );
		let tabs = this.getTabs( depth );
		let objContentName = "Content-" + Math.random();
		let data = this.processObject( obj, key, 1 );
		let out = "";
		if ( data.length < 1 ) {
			return this.getTabs( depth ) + keyName +" []interface{} " + annot
		}
		out = "type "+this.singular( keyName ) + " struct {" + this.opts.newLine + objContentName + this.opts.newLine + "}";
		out = out.replace( objContentName, data.join( this.opts.newLine ) );
		let hash = this.getObjHash( obj );
		let total = this.addToContainer( keyName, out, hash );
		let append = "";
		if ( total > 0 ) {
			// TODO
			//append = total;
		}
		return tabs + keyName + " []" + this.singular( keyName ) + append +" "+ this.annotate( key );
	},

	getTabs: function( count ) {
		let tabs = "";
		for ( let i = 0; i < count; i++ ) {
				tabs += Jogo.opts.tabChar;
		}
		return tabs;
	},

	getType: function( obj ) {
		let t = typeof obj
		switch( t ) {
		case "string":
			return "string";
		case "number":
			if ( obj === Math.floor( obj ) ) {
				return "int"
			}
			return "float32";
		case "boolean":
			return "bool";
		}
		if ( this.isArray( obj ) ) {
			return "array";
		}
		return "interface{}";
	},

	getXMLType: function( obj ) {
		if ( obj.attributes.length ) {
			return "attr";
		}
		if ( obj.children && obj.children.length ) {
			return "object";
		}
		let t = typeof obj.textContent
		switch( t ) {
		case "string":
			return "string";
		case "number":
			if ( obj === Math.floor( obj ) ) {
				return "int"
			}
			return "float32";
		case "boolean":
			return "bool";
		}
		if ( this.isArray( obj ) ) {
			return "array";
		}
		return "interface{}";
	},

	isArray: function( obj ) {
		return Array.isArray( obj );
	},

	isEmptyObj: function( obj ) {
		let count = 0;
		for ( let i in obj ){
			if ( obj.hasOwnProperty( i ) ) {
				count++;
				break;
			}
		}
		return count === 0;
	},

	annotate: function( name ){
		if ( !this.opts.annotation ) {
			return "";
		}
		let omit = this.opts.omitempty? ",omitempty" : "";
		return "`json:\"{}\"`".replace( "{}", name + omit );
	},

	formatName: function( name ){
		let cap = name[ 0 ].toUpperCase() + name.substr( 1 );
		cap = cap.replace( /_\S/g, function( a ) {
			return a[ 1 ].toUpperCase();
		});
		return cap.replace( /(^|[^a-zA-Z])([a-z]+)/g, function( unused, sep, frag ) {
			if ( Jogo.goKeys.indexOf( frag.toUpperCase() ) >= 0 ){
				return sep + frag.toUpperCase();
			}
			return sep + frag[ 0 ].toUpperCase() + frag.substr( 1 ).toLowerCase();
		}).replace( /([A-Z])([a-z]+)/g, function( unused, sep, frag ){
			if ( Jogo.goKeys.indexOf( sep + frag.toUpperCase() ) >= 0) {
				return ( sep + frag ).toUpperCase();
			}
			return sep + frag;
		});
	},

	_formatRange : function( group, from, to, pads, depth){
		let out = [];
		for ( let i = from, l = to; i < l; i++ ) {
			let line = group[ i ].trim();
			let words = line.split( /\s/ );
			if( words.length < 3 ) {
				out.push( group[ i ] );
				continue;
			}
			let str = this.getTabs( depth ) +
				words[ 0 ].padEnd( pads.left + 1 ) +
				words[ 1 ].padEnd( pads.mid + 1 ) +
				words[ 2 ].padEnd( pads.right + 1 );
			out.push( str );
		}
		return out;
	},

	singular: function( name ) {
		var ies = name.substr( -3 );
		var xes = ies;
		var ses = ies;
		var es = name.substr( -2 );
		var s = name.substr( -1 );
		if ( ies === "ies" ) {
			return name.substr( 0, name.length - 3 ) + "y";
		}
		if ( ies === "xes" ) {
			return name.substr( 0, name.length - 3 ) + "x";
		}
		if ( ses === "ses" ) {
			return name.substr( 0, name.length - 3 ) + "s";
		}
		if ( es === "es" ) {
			return name.substr( 0, name.length - 2 ) + "e";
		}
		if ( s === "s" ) {
			return name.substr( 0, name.length - 1 );
		}
		return name;
	},

	getObjHash: function( obj ) {
		let arr = [];
		for ( let i in obj ) {
			arr.push( i )
		}
		let str = JSON.stringify( arr );
		return this.hash( str );
	},

	hash: function ( str ) {
		let hash = 5381,
		i = str.length;
		while( i ) {
			hash = ( hash * 33 ) ^ str.charCodeAt( --i );
		}
		/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
		* integers. Since we want the results to be always positive, convert the
		* signed int to an unsigned by doing an unsigned bitshift. */
		return hash >>> 0;
	},

	addToContainer: function( name, str, hash ) {
		let count = 0;
		for ( let i = 0, l = this.container.length; i < l; i++ ) {
			if ( this.container[i].name === name ) {
				if ( this.container[i].hash === hash ){
					return 0;
				}
				count++;
			}
		}
		this.container.push( { name: name, content: str, hash: hash } );
		return count;
	},

	getContainers : function() {
		let c = [];
		for ( let i = 0, l = this.container.length; i < l; i++ ) {
			c.push( this.container[ i ].content );
		}
		return c;
	},
};

if ( typeof define === "function" && define.amd ) {
	define( function() { return Jogo; } );
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Jogo;
} else {
	root.Jogo = Jogo;
}

})();
