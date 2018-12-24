package jogo

import (
	"fmt"
	"io/ioutil"
	"testing"
)

var data = map[string]string{
	"json": "../testdata/sample.json.txt",
	"xml":  "../testdata/sample.xml.txt",
	"txt":  "../testdata/sample.txt",
}

func init() {
}

func getFileContent(path string) (string, error) {
	byt, err := ioutil.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("failed to read file %s", path)
	}
	return string(byt), nil
}

func TestJSON(t *testing.T) {
	t.Parallel()
	j := New()
	dataJSON, err := getFileContent(data["json"])
	if err != nil {
		t.Fatal(err)
	}
	err = j.Process(dataJSON)
	if err != nil {
		t.Fatal(err)
	}
}

func TestXML(t *testing.T) {
	t.Parallel()
	j := New()
	dataXML, err := getFileContent(data["xml"])
	if err != nil {
		t.Fatal(err)
	}
	err = j.Process(dataXML)
	if err != nil {
		t.Fatal(err)
	}
}

func TestBadData(t *testing.T) {
	t.Parallel()
	j := New()
	dataTXT, err := getFileContent(data["txt"])
	if err != nil {
		t.Fatal(err)
	}
	err = j.Process(dataTXT)
	if err == nil {
		t.Fatal(err)
	}
}
