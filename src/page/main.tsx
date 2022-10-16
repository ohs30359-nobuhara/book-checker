import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BookList } from './component/bookList'
import {ChangeEvent, CSSProperties, useEffect, useState} from "react";

interface Item {
  Title: string
  SubTitle: string
  Image: string
  Preview: string
  Isbn10: string
  Isbn13: string
}

const style: {[key: string]: CSSProperties} = {
  input: {
    width: "100%"
  },
  icon: {
    fontSize: "30px",
    marginRight: "5px"
  },
  title: {
    fontSize: "25px"
  },
  nav: {
    marginBottom: "20px"
  }
}

const App = () => {
  const [list, setList] = useState<Item[]>([]);
  const [filteredList, setFilteredList] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const list: Item[] = await (await fetch("https://ohs30359-nobuhara.github.io/book-checker/resources/books.json")).json();
      setList(list);
      setFilteredList(list);
    })();
  },[])

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const val: string = e.target.value.toLowerCase()

    if (val.trim().length === 0) {
      return setFilteredList(list);
    }

    const target: Item[] = list.filter(item => {
      return item.Title.toLowerCase().includes(val) || item.Isbn10.includes(val) || item.Isbn13.includes(val)
    });

    setFilteredList(target);
  }

  return (
    <div className="columns">
      <div className={"column is-10 is-offset-1"}>
        <nav className="navbar" role="navigation" aria-label="main navigation" style={style.nav}>
          <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
              <span className="material-icons" style={style.icon}>local_library</span> <strong style={style.title}>Book Checker</strong>
            </a>
            <div className="navbar-item" style={style.input}>
              <input className="input is-primary" type="text" placeholder="key word" onChange={handleChange} />
            </div>
          </div>
        </nav>
        <BookList items={filteredList}/>
      </div>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#app'));
