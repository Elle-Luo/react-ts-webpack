# webpack
  - 创建目录，并yarn init初始化一个包管理器
  - 安装webpack *yarn add webpack webpack-cli -D*
  - 想要将es6转化为es5语法，需要用到babel插件对代码进行编译，所以需要安装babel和相应的loader
    *yarn add @babel/core @babel/preset-env babel-loader -D*
  - 配置 .babelrc
  - 创建src/index.js入口
  - 创建输出文件dist/html
  - 配置webpack.config.js
  - 最后通过构建命令 *./node_modules/.bin/webpack --config webpack.config.js --mode development* 进行配置，会生成一个dist/bundle.js文件，这就是转换后的js文件

  上面使用了webpack的几个核心概念
    1. 入口entry: 在webpack的配置文件中通过配置entry告诉webpack所有模块的入口
    2. 输出output: 配置编译后的文件存放在哪里，以及如何命名
    3. loader: 就是一个pure function，它帮助webpack通过不同的loader处理各种的资源，比如babel-loader处理js资源，然后通过loader的配置，讲输入的es6语法转换成es5语法再输出
    4. plugin: plugin就是loader的增强版，loader只能用来转换不同类型的模块，而plugin能执行的任务更多，包括打包优化、资源管理、注入环境变量等

# 添加webpack配置
## 解析React + TS
  1. 首先安装需要的库
    *yarn add react react-dom react-hot-loader -S*
    *yarn add typescript ts-loader @hot-loader/react-dom -D*
  2. 修改babel
  
  ``` json
  {
    "presets": [
      [
        "@babel/preset-env",
        {
          "modules": false
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": [
      "react-hot-loader/babel"
    ]
  }
  ```

  3. 配置tsconfig.json

  ``` json
  {
    "compilerOptions": {
      "outDir": "./dist/",
      "sourceMap": true,
      "strict": true,
      "noImplicitReturns": true,
      "noImplicitAny": true,
      "module": "es6",
      "moduleResolution": "node",
      "target": "es5",
      "allowJs": true,
      "jsx": "react",
    },
    "include": [
      "./src/**/*"
    ]
  }
  ```

  4. 配置解析react和ts的loader

  ``` js
  const config = {
      ...
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // 新增加了jsx，对React语法的解析
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.ts(x)?$/, // 对ts的解析
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    ...
  };

  module.exports = config;
  ```

## 解析图片和文字
  1. 下载loader 
    *yarn add file-loader url-loader -D*
  2. 修改webpack配置

  ``` js
  const config = {
      ...
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/, // 解析字体资源
          use: 'file-loader'
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/, // 解析图片资源，小于10kb的图解析为base64
          use: [
              {
                  loader: 'url-loader',
                  options: {
                      limit: 10240
                  }
              }
          ]
        },
      ]
    },
    ...
  };
  ```

## 解析css、less
使用MiniCssExtractPlugin将js中的css分离出来，形成单独的css文件，并使用postcss-loader生成兼容各浏览器的css
  1. 安装loader
  2. 配置postcss.config.js

  ``` js
  module.exports = {
    plugins: [
      require('autoprefixer')
    ]
  };
  ```
  3. 配置webpack

  ``` js
  // 引入plugin
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const config = {
      ...
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ],
          exclude: /\.module\.css$/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true
              }
            },
            'postcss-loader'
          ],
          include: /\.module\.css$/
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader'
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin()
    ],

    ...
  };
  ```

# 增加第三方库
## React Router
  1. 安装&配置React-Router
    1. 安装react-router *yarn add react-router-dom*
    2. 安装@babel/plugin-syntax-dynamic-import来支持动态import *yarn add @babel/plugin-syntax-dynamic-import*
    3. 将动态倒入插件添加到babel中
  2. webpack配置
    使用React Router6 BroserRouter，是基于html5规范的window.history来实现路由状态管理的，他不同与使用hash来保持UI和url同步，使用了  
    BrowserRouter后，每次的url变化都是一次资源请求，所以在使用时，需要在webpack中配置，以防止加载页面时出现404

  ``` json
  "devServer": {
    // 将所有的404请求redirect到 publicPath指定目录下的index.html上
    "historyApiFallback": true,
  },
  ```

## React Router v5







