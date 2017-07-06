// 该配置基于webpack2.0 详情查看 https://webpack.js.org/guides/migrating/
const path = require('path'); // 导入路径包
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin'); //webpack插件，用于清除目录文件

module.exports = {
    entry: './src/main.js', //入口文件
    output: {
        path: path.resolve(__dirname, 'build'), // 指定打包之后的文件夹
        // publicPath: '/assets/', //指定资源文件引用的目录
        // filename: 'bundle.js' // 指定打包为一个文件 bundle.js
        filename: '[name]-[hash].js' // 可以打包为多个文件
    },
    // 使用loader模块
    module: {
        /* 
         * 在webpack2.0版本已经将 module.loaders 改为 module.rules, 当然module.loaders也是支持的。
         * 同时链式loader(用!连接)只适用于module.loader，同时-loader不可省略 
         */
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader', 
                use: [{
                    loader: 'css-loader',
                    options: {
                      // modules: true // 设置css模块化,详情参考https://github.com/css-modules/css-modules
                    }
                }, {
                    loader: 'postcss-loader',
                    // 在这里进行配置，也可以在postcss.config.js中进行配置，详情参考https://github.com/postcss/postcss-loader
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }
            ]})
        }, {
            test: /\.styl(us)?$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', {
                    loader: "postcss-loader",
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }, 'stylus-loader']
            })
        }, {
            test: /\.js$/,
            loader: 'babel-loader', 
            exclude: /node_modules/ //需要排除的目录
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html' // 模版文件
        }),
        new CleanPlugin(['build']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
        }),
        new webpack.optimize.UglifyJsPlugin({ //压缩js代码
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('[name]-[hash].css')
    ]
}
