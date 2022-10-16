import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CSSProperties, useState} from "react";

interface Props {
  items: {
    Title: string
    SubTitle: string
    Image: string
    Preview: string
  }[]
}

const style: {[key: string]: CSSProperties} = {
  imgContents: {
    backgroundColor: "#e1e1e14d",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  img: {
    width: "150px",
    height: "200px"
  },
  pagination: {
    display: "flex",
    justifyContent: "center"
  }
}

export const BookList = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const pages: JSX.Element[] = sliceArray(props.items, 4).map(arr => {
    const col: JSX.Element[] = arr.map((item, i) => {
      return <div className="tile is-vertical is-3">
        <div className="tile is-parent is-vertical">
          <div style={style.imgContents}>
            <img src={item.Image} style={style.img}/>
          </div>
          <article className="tile is-child" style={{marginTop: "20px"}}>
            <p style={{marginTop: "20px"}}><strong>{item.Title}</strong></p>
            <small>{item.SubTitle}</small>
          </article>
        </div>
      </div>
    })

    return <div className="tile"> {col} </div>
  })

  const pageList: Array<JSX.Element[]> = sliceArray(pages, 4);

  return (
    <div>
      {pageList[activeIndex]}
      <nav className="pagination" role="navigation" aria-label="pagination">
        <ul className="pagination-list" style={style.pagination}>
          { pageList.map((page, i) =>
            <li>
              <a className={ activeIndex === i? "pagination-link is-current" : "pagination-link" } onClick={() => setActiveIndex(i)}>{i+1}</a>
            </li>)
          }
        </ul>
      </nav>
    </div>
  )
}

function sliceArray<T>(array: Array<T>, split: number): Array<T[]> {
  const length = Math.ceil(array.length / split);

  return new Array(length)
    .fill(null)
    .map((_, i) => array.slice(i * split, (i + 1) * split));
}
