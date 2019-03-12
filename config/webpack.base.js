const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
let glob = require("glob")

const config = {
    host:"localhost",
    port:3000,
    baseDir:"app/"
}

//组装所有的入口文件
let entrys = {};
let jsFiles = glob.sync(path.join(__dirname,`../${config.baseDir}views`) + '/**/**/*.js')
for (let index = 0; index < jsFiles.length; index++) {
    const jsElem = jsFiles[index];
    let filename = jsElem.substring(jsElem.indexOf("app"),jsElem.indexOf(".js"))
    entrys[`${filename}`] = jsElem;
    
}

//组装所有html输出文件
let plugins = [];
let pagePlugins = []
let htmlFiles = glob.sync(path.join(__dirname,`../${config.baseDir}views`) + '/**/*.html')
for (let index = 0; index < htmlFiles.length; index++) {
    const htmlElem = htmlFiles[index];
    let chunks = htmlElem.substring(htmlElem.indexOf("app"),htmlElem.indexOf("index.html"))
    pagePlugins.push(
        new HtmlWebpackPlugin({
            minify:{
                removeAttributeQuotes:true  // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
            },
            filename:htmlElem.replace("app","build/app"),
            template: htmlElem,
            chunks:[`${chunks}js/index`]
        })
    )
}

plugins = [...pagePlugins]

module.exports = {
    entry:entrys,
    output:{
        path:path.join(__dirname,"../build"),
        filename:"[name].min.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    plugins:[
        new copyWebpackPlugin([{
            from: path.join(__dirname,`../${config.baseDir}asserts`),//打包的静态资源目录地址
            to:'./app/asserts' //打包到dist下面的public
        }]),
        new CleanWebpackPlugin(),
        ...plugins
    ],
    devServer: {
        contentBase: path.join(__dirname, "../build"),
        host: config.host,
        port: config.port
    }
}