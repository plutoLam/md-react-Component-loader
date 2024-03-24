# 一个webpack loader，将Markdown转为React组件

![](https://img.shields.io/badge/author-PlutoLam-f66.svg#crop=0&crop=0&crop=1&crop=1&id=OXVaV&originHeight=20&originWidth=108&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/version-0.0.3-f66.svg#crop=0&crop=0&crop=1&crop=1&id=Nc47V&originHeight=20&originWidth=90&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/web-%3E%3D%2095%25-3c9.svg#crop=0&crop=0&crop=1&crop=1&id=LyZIm&originHeight=20&originWidth=90&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/node-%3E%3D%208.0.0-3c9.svg#crop=0&crop=0&crop=1&crop=1&id=GoxKU&originHeight=20&originWidth=98&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/test-passing-f90.svg#crop=0&crop=0&crop=1&crop=1&id=b74TK&originHeight=20&originWidth=82&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/build-passing-f90.svg#crop=0&crop=0&crop=1&crop=1&id=iQz3r&originHeight=20&originWidth=88&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/coverage-90%25-09f.svg#crop=0&crop=0&crop=1&crop=1&id=h35xX&originHeight=20&originWidth=96&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/license-MIT-09f.svg#crop=0&crop=0&crop=1&crop=1&id=PxjBJ&originHeight=20&originWidth=78&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)



开发过程已发布到掘金：


### 安装

```javascript
npm i md-react-component-loader
```
```javascript
yarn add md-react-component-loader
```



### 配置

```javascript
{
    test: /\.md$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        //这里写 loader 的路径
        loader: "md-react-component-loader",
        options: {
          isFunctionComponent: true, // true为函数组件，false为类组件
        },
      },
],
```



### 使用

```jsx
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
```

````markdown
// hello.md
---
imports: |
  import Button from '../components/Button.jsx';

  import test from '../utils/util.js'
author: plutoLam
time: 2023/12/03
version:
---

# Hello, World

这是一行:{}

<Button onClick={test}>test</Button>

```java
const b = 1;
```
````

转为以下代码

```jsx
import React from "react";
import Button from "../components/Button.jsx";

import test from "../utils/util.js";

export const author = "plutoLam";
export const time = "2023/12/03";
export const version = null;
const App = () => (
  <>
    <h1>Hello, World</h1>
    <p>这是一行:&#123;&#125;</p>
    <p>
      <Button onClick={test}>test</Button>
    </p>

    <pre>
      <code className="language-java">
        <span className="token keyword">const</span> b{" "}
        <span className="token operator">=</span>{" "}
        <span className="token number">1</span>
        <span className="token punctuation">;</span>
      </code>
    </pre>
  </>
);
export default App;
```

代码高亮得另外安装[prismjs](https://www.npmjs.com/package/prismjs)，然后全局引入`css`

```javascript
import "prismjs/themes/prism.css";
```



### 功能

1. 配置完成后直接在React中引入Markdown即可自动将Markdown转为React组件
2. 会对非HTML中的`{`和`}`进行转义，避免React将其解析为JS
3. 在Markdown最顶部写YAML即可定义该Markdown信息，其中`imports`为关键字，loader会将其解析为JS，可以在`imports`中引入其他组件
4. 可在Markdown中写JSX，并使用在`imports`引入的JS

