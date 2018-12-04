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
	init: function(mode) {
		this.mode = mode || "cli";
		this.box = document.getElementById("box")
		this.varField = document.getElementById("varname");
		this.textField = document.getElementById("textarea");
		this.convBtn = document.getElementById("convBtn");
		this.textField.value = JSON.stringify(sample,null,"  ");
		this.convBtn.onclick = function() {
			let c = Jogo.convert(Render.varField.value,Render.textField.value);
			Render.display(c);
		};
		let c = Jogo.convert(this.varField.value,this.textField.value);
		Render.display(c);
	},

	display: function(containers) {
		this.box.innerHTML = "";
		for (let i = 0, l = containers.length; i < l; i++) {
			let div = document.createElement("div");
			div.id = "go-struct-"+i;
			div.className = "go-struct";
			div.innerHTML = containers[i];
			this.box.appendChild(div);
		}
	}

};


if ( typeof define === "function" && define.amd ) {
	define(function() { return Render; });
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Render;
} else {
	window.Render = Render;
}

})( window, document );
