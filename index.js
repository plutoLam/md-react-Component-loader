const { marked } = require("marked");
const { markedXhtml } = require("marked-xhtml");

module.exports = function (source, map) {
  const options = this.query;
  const { isFunctionComponent = true } = options;
  marked.use(markedXhtml());
  const htmlText = marked.parse(source);

  console.log("htmlText: ", htmlText);
  const reactCmp = isFunctionComponent
    ? `
  import React from 'react'
  const App = () => (<>${htmlText}</>);
  export default App;
`
    : `
  import React, { Component } from 'react';
  class App extends Component{
    render() {
      return (<>${htmlText}</>)
    }
  }
  export default App;
`;
  return reactCmp;
};
