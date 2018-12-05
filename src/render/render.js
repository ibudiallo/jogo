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
		this.update();
	},

	update: function() {
		let c = Jogo.convert( this.varField.value, this.textField.value );
		this.display( c );
	},

	display: function( containers ) {
		this.box.innerHTML = "";
		for ( let i = 0, l = containers.length; i < l; i++ ) {
			let div = document.createElement( "div" );
			div.id = "go-struct-" + i;
			div.className = "go-struct";
			div.innerHTML = containers[ i ];
			this.box.appendChild( div );
		}
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
