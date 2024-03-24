import React from 'react';
import ReactDOM from 'react-dom';
import Hello, {author, time, version} from './md/hello.md'
import "prismjs/themes/prism.css";
const App = () => {
  return (
    <>
      <Hello/>
      <p>author：{author}</p>
      <p>time：{time}</p>
      <p>version：{version}</p>
    </>
  )
}
ReactDOM.render(<App/>, document.getElementById('root'));