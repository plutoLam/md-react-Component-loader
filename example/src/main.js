import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './md/hello.md'

const App = () => {
  return (
    <>
      <Hello/>
    </>
  )
}
ReactDOM.render(<App/>, document.getElementById('root'));