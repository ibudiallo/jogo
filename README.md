# JOGO

Jogo is a json to go converter. JSON goes in one end and a Go struct comes out the other end.

## How to use it

### Command line (Go lang)

#### Install

Go to the golang folder:

	cd src/golang/cmd/jogo

Install with go install, then run it.

	go install
	jogo testdata/sample.json

### Command line (nodejs)

Clone the repo then run `index.js` with the json file as a parameter.

	node index.js testdata/sample.txt

### On the browser

Clone the repo then open the file `test/index.html` on your browser. Paste your json content on the left side and click on convert. The result should appear on the right side.

## TODO

- add nodejs support (done)
- add xml support on browser (done)
- add xml support on node (pending)
- add golang support (incomplete)
