const { marked } = require("marked");
const { markedXhtml } = require("marked-xhtml");
const renderer = new marked.Renderer();
function replaceString(str) {
  if (typeof str !== "string") return str;
  return str?.replace(/[\{]/g, "&#123;")?.replace(/[\}]/g, "&#125;");
}

function codeReplace(code, infoString) {
  console.log("code, infoString: ", code, infoString);
  // 对code进行处理
  return replaceString(`
    <pre>
      <code>
        ${code}
      </code>
    </pre>
  `);
}
function rewrite(fn) {
  return function() {
    const afterString = fn.apply(renderer, [...arguments])
    console.log('afterString: ', afterString);
  }
}
renderer.code = rewrite(renderer.code)
// const renderer = {
//   code: codeReplace,
//   blockquote: replaceString,
//   html: replaceString,
//   heading: replaceString,
//   hr: replaceString,
//   list: replaceString,
//   listitem: replaceString,
//   checkbox: replaceString,
//   paragraph: replaceString,
//   table: replaceString,
//   tablerow: replaceString,
//   tablecell: replaceString,
//   strong: replaceString,
//   em: replaceString,
//   codespan: replaceString,
//   br: replaceString,
//   del: replaceString,
//   link: replaceString,
//   image: replaceString,
//   text: replaceString,
// };
// const label = [
//   "code",
//   "blockquote",
//   "html",
//   "heading",
//   "hr",
//   "list",
//   "listitem",
//   "checkbox",
//   "paragraph",
//   "table",
//   "tablerow",
//   "tablecell",
//   "strong",
//   "em",
//   "codespan",
//   "br",
//   "del",
//   "link",
//   "image",
//   "text",
// ];
// const extensions = label.map(v => {
//   return {
//     name: v,
//     renderer(token) {
//       console.log('token: ', token);
//       return replaceString(token.raw)
//     }
//   }
// })
// renderer.code = replaceString;
module.exports = function (source, map) {
  const options = this.query;
  const { isFunctionComponent = true } = options;
  marked.use(markedXhtml());
  marked.use({ renderer });
  // marked.use({extensions})
  // marked.use({
  //   extensions: [
  //     {
  //       name: "link",
  //       renderer(token) {
  //         console.log("link: ", token);
  //         return token;
  //       },
  //     },
  //     {
  //       name: "html",
  //       renderer(token) {
  //         console.log("html: ", token);
  //         return token;
  //       },
  //     },
  //   ],
  // });

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
