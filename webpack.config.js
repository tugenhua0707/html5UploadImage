// 导入路径包
const path = require('path'); 
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    //开启sourceMap便于调试
    devtool: 'eval-source-map', 

    //入口文件，
    entry: ['whatwg-fetch', './src/index.js'], 

    output: {
        // 输出文件到当前目录下的 build文件夹内
        path: path.resolve(__dirname, 'build'), 

        publicPath: '/assets/', //指定资源文件引用的目录

        filename: 'bundle.js' // 指定打包为一个文件 bundle.js
        // filename: '[name].js' // 可以打包为多个文件

    },
    // 使用loader模块
    module: {
        /* 
         * 在webpack2.0版本已经将 module.loaders 改为 module.rules, 当然module.loaders也是支持的。
         * 同时链式loader(用!连接)只适用于module.loader，同时-loader不可省略 
         */
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader', {
                loader: 'css-loader',
                options: {
                  // modules: true // 设置css模块化,详情参考 https://github.com/css-modules/css-modules
                }
              }, 
              {
                loader: 'postcss-loader',
                // 参考 https://github.com/postcss/postcss-loader
                options: {
                  plugins: function() {
                    return [
                      require('autoprefixer')
                    ];
                  }
                }
              }]
          }, 
          {
            test: /\.styl(us)?$/,
            use: [
                'style-loader', 'css-loader', {
                   loader: "postcss-loader",
                   options: {
                      plugins: function() {
                        return [
                          require('autoprefixer')
                        ];
                      }
                    }
                }, 'stylus-loader']
          }, 
          {
            test: /\.js$/,
            loader: 'babel-loader', 
            exclude: /node_modules/ //需要排除的目录
          }
        ]
    },
    // 配置devServer各种参数
    devServer: {
        // contentBase: "./",   // 本地服务器所加载的页面所在的目录
        hot: true,              // 配置HMR之后可以选择开启
        historyApiFallback: true, // 不跳转
        inline: true // 实时刷新
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html' // 模版文件
        }),
        new webpack.HotModuleReplacementPlugin() // 热加载插件
    ]
}
