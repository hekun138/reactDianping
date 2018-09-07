const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'app/index.jsx'),
	output: {
		path: __dirname + "/build",
		filename: "bundle.js"
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/, //test去判断是否为.js或.jsx，是的话就用es6和jsx编译
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.(less|css)?$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.(jpg|jpeg|gif|bmp|png|webp)?$/i,
				exclude: /(node_modules|bower_components)/,
				loader: 'file-loader'
			},
			{
				test: /\.(woff|woff2|svg|ttf|eot)?$/i,
				exclude: /(node_modules|bower_components)/,
				loader: 'file-loader'
			}
		]
	},
	plugins: [
		//html 模板插件
		new HtmlWebpackPlugin({
			template: __dirname + '/app/index.html'
		}),
		//热加载插件
		new webpack.HotModuleReplacementPlugin(),
		//打开浏览器
		new OpenBrowserPlugin({
			url: 'http://localhost:8080'
		}),
		//可在业务js代码里使用 __DEV__判断是否是dev模式（dev模式下可以提示错误、测试报告等，production模式不提示）
		new webpack.DefinePlugin({
			__DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
		})
	],
	devServer: {
		proxy: {
			//凡是'/api'开头的http请求，都会被代理到localhost:3000上，由koa提供mock数据
			//koa代码在./mock目录中，启动命令为npm run mock
			'/api': {
				target: 'http://localhost:3000',
				secure: false
			}
		},
		color: true, //终端输出结果为彩色
		contentBase: "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback: true,//不跳转
		inline: true,
		hot: true,
		disableHostCheck: true,
		host: '0.0.0.0'
	}
}