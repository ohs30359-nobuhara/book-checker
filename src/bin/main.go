package main

import (
	"encoding/json"
	"errors"
	"flag"
	"io/ioutil"
	"net/http"
)

func main() {
	filePath := "./docs/resources/books.json"

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

	// 追加する前に重複確認
	duplication := false
	for _, item := range books {
		if item.Isbn10 == book.Isbn10 || item.Isbn13 == book.Isbn13 {
			duplication = true
			break
		}
	}

	if duplication {
		panic("isbn is duplicate")
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
			IndustryIdentifiers []struct{
				Type string `json:"type"`
				Identifier string `json:"identifier"`
			} `json:"industryIdentifiers"`
			PreviewLink string `json:"previewLink"`
		}`json:"volumeInfo"`
	} `json:"items"`
}

type Book struct {
	Title string
	SubTitle string
	Image string
	Preview string
	Isbn10 string
	Isbn13 string
}

func getBookInfo(isbn string) (Book, error)  {
	url := "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn

	resp, _ := http.Get(url)
	defer resp.Body.Close()

	buf, _ := ioutil.ReadAll(resp.Body)

	println(string(buf))

	var res ApiResponse
	if e := json.Unmarshal(buf, &res); e != nil {
		return Book{}, errors.New("fail request")
	}

	if res.TotalItems != 1 {
		return Book{}, errors.New("request isbn is not found")
	}

	// ISBNなので必ず1件HIT
	var book Book
	for _, item := range res.Items {
		book.Title = item.VolumeInfo.Title
		book.SubTitle = item.VolumeInfo.SubTitle
		book.Image = item.VolumeInfo.ImageLinks.Thumbnail
		book.Preview = item.VolumeInfo.PreviewLink

		for _, identifier := range item.VolumeInfo.IndustryIdentifiers {
			switch identifier.Type {
			case "ISBN_10":
				book.Isbn10 = identifier.Identifier
				break
			case "ISBN_13":
				book.Isbn13 = identifier.Identifier
			}
		}
	}

	return book, nil
}
