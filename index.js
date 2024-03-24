const { marked } = require("marked");
const fm = require("front-matter");
const { markedXhtml } = require("marked-xhtml");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
const renderer = new marked.Renderer();
function replaceString(str) {
  if (typeof str !== "string") return str;
  return str
    ?.replace(/[\{]/g, "&#123;")
    ?.replace(/[\}]/g, "&#125;")
    .replace(/class="/g, 'className="');
}

function codeReplace(code, lang) {
  console.log("code, lang: ", code, lang);
  let langClss = '',html = code
  try {
    loadLanguages([lang]);
    html = Prism.highlight(code, Prism.languages[lang], lang);
    langClss = `language-${lang}`
  } catch (error) {
    console.log(error)
  }
  

  return replaceString(`
    <pre>
      <code class="${langClss}">
        ${html}
      </code>
    </pre>
  `);
}
function rewrite(fn) {
  return function () {
    const afterString = fn.apply(renderer, [...arguments]);
    console.log("afterString: ", afterString, fn);
    return replaceString(afterString);
  };
}

// 块元素
renderer.code = rewrite(codeReplace);
renderer.blockquote = rewrite(renderer.blockquote);
renderer.heading = rewrite(renderer.heading);
//renderer.html = renderer.html;
renderer.hr = rewrite(renderer.hr);
renderer.list = rewrite(renderer.list);
renderer.listitem = rewrite(renderer.listitem);
renderer.checkbox = rewrite(renderer.checkbox);
// renderer.paragraph = renderer.paragraph;
renderer.table = rewrite(renderer.table);
renderer.tablerow = rewrite(renderer.tablerow);
renderer.tablecell = rewrite(renderer.tablecell);

// 行元素
renderer.strong = rewrite(renderer.strong);
renderer.em = rewrite(renderer.em);
renderer.codespan = rewrite(renderer.codespan);
renderer.br = rewrite(renderer.br);
renderer.del = rewrite(renderer.del);
renderer.link = rewrite(renderer.link);
renderer.image = rewrite(renderer.image);
renderer.text = rewrite(renderer.text);

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
  marked.use({ renderer }); // 这一句要在上面
  marked.use(markedXhtml());

  const fmParsed = fm(source);
  const attributes = fmParsed.attributes;
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

  let exportStr = "";
  for (const key in attributes) {
    if (key === "imports") continue;
    exportStr += `export const ${key} = ${JSON.stringify(attributes[key])};`;
  }

  const htmlText = marked.parse(fmParsed.body);
  // console.log("htmlText: ", htmlText);
  const reactCmp = isFunctionComponent
    ? `
  import React from 'react'
  ${attributes.imports ? attributes.imports : ""}
  ${exportStr}
  const App = () => (<>${htmlText}</>);
  export default App;
`
    : `
  import React, { Component } from 'react';
  ${attributes.imports ? attributes.imports : ""}
  ${exportStr}
  class App extends Component{
    render() {
      return (<>${htmlText}</>)
    }
  }
  export default App;
`;
  console.log("reactCmp: ", reactCmp);
  return reactCmp;
};
