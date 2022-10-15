package main

import (
	"encoding/json"
	"errors"
	"flag"
	"io/ioutil"
	"net/http"
)

func main() {
	filePath := "./public/resources/books.json"

	f := flag.String("isbn", "", "input isbn code")
	flag.Parse()

	if *f == "" {
		panic("--isbn is required")
	}

	book, e := getBookInfo(*f)

	if e != nil {
		panic(e.Error())
	}

	buf, e := ioutil.ReadFile(filePath)

	if e != nil {
		panic(e.Error())
	}

	var books []Book

	// ファイルが空でなければ既存データを配列に突っ込む
	if len(buf) != 0 {
		if e = json.Unmarshal(buf, &books); e != nil {
			panic(e.Error())
		}
	}

	books = append(books, book)
	buf, e = json.Marshal(books)

	if e != nil {
		panic(e.Error())
	}

	if e = ioutil.WriteFile(filePath, buf, 0644); e != nil {
		panic(e.Error())
	}
}

type ApiResponse struct {
	TotalItems int64 `json:"totalItems"`
	Items []struct{
		VolumeInfo struct{
			Title string `json:"title"`
			SubTitle string `json:"subtitle"`
			ImageLinks struct{
				Thumbnail string `json:"thumbnail"`
			} `json:"imageLinks"`
			PreviewLink string `json:"previewLink"`
		}`json:"volumeInfo"`
	} `json:"items"`
}

type Book struct {
	Title string
	SubTitle string
	Image string
	Preview string
}

func getBookInfo(isbn string) (Book, error)  {
	url := "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn

	resp, _ := http.Get(url)
	defer resp.Body.Close()

	buf, _ := ioutil.ReadAll(resp.Body)

	var res ApiResponse
	if e := json.Unmarshal(buf, &res); e != nil {
		return Book{}, errors.New("fail request")
	}

	if res.TotalItems != 1 {
		return Book{}, errors.New("request isbn is not found")
	}

	// ISBNなので必ず1件HIT
	var book Book
	for _, v := range res.Items {
		book.Title = v.VolumeInfo.Title
		book.SubTitle = v.VolumeInfo.SubTitle
		book.Image = v.VolumeInfo.ImageLinks.Thumbnail
		book.Preview = v.VolumeInfo.PreviewLink
	}

	return book, nil
}
