/* global sample */
(function ( window, document ) {

var Render = {
	mode: null,
	box: null,
	varField: null,
	obj: null,
	textField : null,
	convBtn: null,
	container: [],
	tabChar: "\t",
	form: null,
	optionBtn: null,
	option: { visible: false },

	init: function( mode ) {
		this.mode = mode || "cli";
		this.box = document.getElementById( "box" )
		this.varField = document.getElementById( "varname" );
		this.textField = document.getElementById( "textarea" );
		this.convBtn = document.getElementById( "convBtn" );
		this.optionBtn = document.getElementById( "option-btn" );
		this.textField.value = JSON.stringify( sample, null,"  " );
		this.convBtn.onclick = function() {
			Render.update();
		};
		this.setUp();
		Render.update();
	},

	setUp: function() {
		let opts = Jogo.opts;
		let that = this;
		this.form = document.getElementById("option-box")
		this.form.tabs.value = opts.tabChar === "\t" ? "tab" : "space";
		this.form.annotation.checked = opts.annotation;
		this.form.omitempty.checked = opts.omitempty;
		for( let i = 0, l = this.form.tabs.length; i < l; i++ ) {
			this.form.tabs[ i ].onchange = function() {
				Render.changeSettings();
			};
		}
		this.form.annotation.onchange = function() {
			Render.changeSettings();
		};
		this.form.omitempty.onchange = function() {
			Render.changeSettings();
		};
		this.optionBtn.onclick = function(){
			that.toggleOptions();
		};
	},

	toggleOptions: function(){
		this.form.style.display = this.option.visible ? "" : "block";
		this.option.visible = !this.option.visible;
	},

	changeSettings: function() {
		Jogo.opts = {
			tabChar: this.form.tabs.value === "tab" ? "\t" : "    ",
			annotation: this.form.annotation.checked,
			omitempty: this.form.omitempty.checked
		};
		this.tabChar = Jogo.opts.tabChar;
		this.update();
	},

	update: function() {
		let c = Jogo.convert( this.varField.value, this.textField.value );
		this.display( c );
	},

	display: function( containers ) {
		this.box.innerHTML = "";
		let startLine = 0;
		for ( let i = 0, l = containers.length; i < l; i++ ) {
			let div = document.createElement( "div" );
			div.id = "go-struct-" + i;
			div.className = "go-struct";
			let html = this.format( containers[ i ], startLine );
			// div.innerHTML = containers[ i ];
			startLine = containers[ i ].split( "\n" ).length;
			div.appendChild( html );
			this.box.appendChild( div );
		}
		this.addLineNumbers( this.box );
	},

	format: function( content, lineNum ) {
		let lines = content.split( "\n" );
		let par = document.createElement( "div" );
		let out = [];
		let level = 0;
		let maxLevel = 0;
		par.className = "big-parent";
		// par.appendChild( current );
		for( let i = 0, l = lines.length; i < l; i++ ) {
			let line = lines[ i ].trim();
			if ( line[ line.length - 1] === "{" ) {
				let g = document.createElement( "div" );
				g.className = "group";
				par.appendChild( g );
				par = g;
				let span = this.createLine( line, i, level, lineNum );
				par.appendChild( span );
				level++;
				maxLevel++;
			} else if ( line[0] === "}" ) {
				level--;
				let span = this.createLine( line, i, level, lineNum );
				par.appendChild( span );
				par = par.parentNode;
			} else {
				let span = this.createLine( line, i, level, lineNum );
				par.appendChild( span );
			}
		}
		while(par.parentNode) {
			par = par.parentNode;
		}
		this.paddling( par, maxLevel );
		let empt = document.createElement( "span" );
		empt.className = "line empty";
		empt.innerText = "\n";
		par.appendChild( empt );
		return par;
	},

	addLineNumbers: function( par ) {
		let all = par.getElementsByClassName( "line" );
		for( let i = 0, l = all.length; i < l; i++ ) {
			let s = all[ i ];
			s.setAttribute( "line", i + 1 );
		}
	},

	createLine: function( line, index, level, lineNum ) {
		let out = this.entityFormat( line, level )
		var e = document.createElement( "span" );
		e.setAttribute( "level", level );
		e.className = "line";
		e.id = "line-" + ( index + lineNum );
		e.innerHTML = out;
		return e;
	},

	entityFormat: function( line, level ) {
		let bits = line.split( /\s/ );
		let out = [];
		switch( bits.length ) {
			case 3:
				out.push( "<span class='syntax-name lvl-name-" + level + "'>" + bits[ 0 ] + "</span>" );
				out.push( "<span class='syntax-type lvl-type-" + level + "'>" + bits[ 1 ] + "</span>" );
				out.push( "<span class='syntax-annot lvl-annot-" + level + "'>" + bits[ 2 ] + "</span>" );
				break;
			case 2:
				out.push( "<span class='syntax-name'>" + bits[ 0 ] + "</span>" );
				out.push( "<span class='syntax-annot'>" + bits[ 1 ] + "</span>" );
				break;
			case 1:
				if ( bits[ 0 ] !== "}" ) {
					out.push( "<span class='syntax-type'>" + bits[ 0 ] + "</span>" );
					break;
				}
			default:
				return this.tabit( level ) + line;
		}
		return this.tabit( level ) + out.join( " " );
	},

	paddling: function ( par, max ) {
		for( let i = 0; i <= max; i++ ) {
			let clName = "lvl-name-" + i;
			let clType = "lvl-type-" + i;
			let clAnno = "lvl-annot-" + i;
			let names = par.getElementsByClassName( clName );
			let types = par.getElementsByClassName( clType );
			let annos = par.getElementsByClassName( clAnno );
			let nameL = 0;
			let typeL = 0;
			let annoL = 0;
			for ( let j = 0, l = names.length; j < l; j++ ) {
				if ( nameL < names[ j ].innerText.length ) {
					nameL = names[ j ].innerText.length;
				}
				if ( typeL < types[ j ].innerText.length ) {
					typeL = types[ j ].innerText.length;
				}
				if ( annoL < annos[ j ].innerText.length ) {
					annoL = annos[ j ].innerText.length;
				}
			}
			for ( let j = 0, l = names.length; j < l; j++ ) {
				names[ j ].innerText = names[ j ].innerText.padEnd( nameL );
				types[ j ].innerText = types[ j ].innerText.padEnd( typeL );
				// May not be needed for annotations
				// annos[ j ].innerText = annos[ j ].innerText.padEnd( annoL );
			}
		}
	},

	tabit: function( count ) {
		let str = "";
		for( let i = 0; i < count; i++ ) {
			str += this.tabChar;
		}
		return str;
	}
};


if ( typeof define === "function" && define.amd ) {
	define( function() { return Render; } );
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Render;
} else {
	window.Render = Render;
}

})( window, document );
