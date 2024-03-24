const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // 开发模式
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //* 配置解析的文件后缀名
        exclude: /(node_modules)/, //* 不做处理的文件夹
        use: [
          //* 应用的解析模块，可以是一个数组，里面的值可以为模块名字符串，模块对象
          {
            loader: "babel-loader", //* 使用 babel-loader进行编译 */
            options: {
              //* 视具体来定，可以是一个字符串或者对象，值会传递到loader里面，为loader选项 */
              presets: ["@babel/preset-env", "@babel/preset-react"], //* 选择使用的编译器
            },
          },
        ],
      },
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
            loader: path.resolve(
              __dirname,
              "../index.js"
            ),
            options: {
              isFunctionComponent: true,
            },
          },
        ],
      },
      {
        test: /\.css$/, // 匹配以 .css 结尾的文件
        use: ['style-loader', 'css-loader'], // 使用 'style-loader' 和 'css-loader' 来处理 CSS 文件
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", //* 配置index映射路径
    }),
  ],
};
