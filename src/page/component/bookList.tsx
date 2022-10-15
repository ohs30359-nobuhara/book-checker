import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CSSProperties, useEffect, useState} from "react";

interface Item {
  Title: string
  SubTitle: string
  Image: string
  Preview: string
}

export const BookList = () => {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      setList(await (await fetch("https://ohs30359-nobuhara.github.io/book-checker/resources/books.json")).json());
    })();
  },[])

  //word-wrap: break-word;
  const components: JSX.Element[] = list.map((item, i) => {
    return (
      <div className="tile is-vertical is-3">
        <div className="tile is-parent is-vertical">
          <article className="tile is-child">
            <img src={item.Image} />
            <p><strong>{item.Title}</strong></p>
            <small>{item.SubTitle}</small>
          </article>
        </div>
      </div>
    )
  })

  return (
    <div>
      <input className="input" type="text" placeholder="Text input" style={{marginBottom: "40px", marginTop: "20px"}}/>
      <div className="tile is-ancestor">
        {components}
      </div>
    </div>
  )
}
