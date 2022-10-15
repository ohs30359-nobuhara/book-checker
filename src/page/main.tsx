import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BookList } from './component/bookList'

const  App = () => {
  return (
    <div className="columns">
      <div className={"column is-10 is-offset-1"}>
        <BookList/>
      </div>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#app'));
