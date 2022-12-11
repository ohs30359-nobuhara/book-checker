# Book-Checker
2重買い防止のために所有している書籍を管理する。  
URL: https://ohs30359-nobuhara.github.io/book-checker/

サーバーを用意するのも面倒なのでCLIでJSONファイルを更新し、それを ``gh-pages``でUI表示する。

## update 
以下のコマンドで `docs/resources/books.json`に指定したISBNの書籍が追加される.
```shell
 go run src/bin/main.go --isbn=${ISBN}
```

UI上で確認する場合は ``open docs/index.html`` でブラウザ表示する.  
反映されているか確認後、masterにcommitすれば更新完了.
※ gh-pages側でcacheを持っているようなのでpushしてから反映までに時間がかかる
