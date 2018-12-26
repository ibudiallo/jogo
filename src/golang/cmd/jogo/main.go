package main

import (
	"fmt"
	"io/ioutil"
	"jogo"
	"os"
)

func main() {
	args := os.Args[1:]
	argc := len(args)
	if argc < 1 {
		usage()
		os.Exit(0)
	}
	if err := process(args); err != nil {
		exitFail(err.Error())
	}
}

func process(files []string) error {
	j := jogo.New()
	for _, f := range files {
		fmt.Printf("processing %s\n", f)
		content, err := getFileContent(f)
		if err != nil {
			return err
		}
		err = j.Process(content)
		if err != nil {
			return err
		}
		j.Print()
	}
	return nil
}

func getFileContent(path string) (string, error) {
	byt, err := ioutil.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("failed to read file %s", path)
	}
	return string(byt), nil
}

func exitFail(errMsg string) {
	fmt.Println(errMsg)
	os.Exit(1)
}

func usage() {
	fmt.Println("")
	fmt.Println("Jogo converts your json or xml files into marshable Go structs")
	fmt.Println("")
	fmt.Println("Usage:")
	fmt.Println("	jogo sample.json")
	fmt.Println("or -")
	fmt.Println("	jogo sample.xml")
	fmt.Println("")
}
