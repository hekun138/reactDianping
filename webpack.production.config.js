const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry: {
		app: path.resolve(__dirname, 'app/index.jsx'),
		//将第三方依赖单独打包
		vendor: [
			'react',
			'react-dom',
			'react-redux',
			'react-router',
			'redux',
			'es6-promise',
			'whatwg-fetch'
		]
	},
	output: {
		path: __dirname + "/build",
		filename: "[name].[chunkhash:8].js",
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/, //test去判断是否为.js或.jsx，是就进行es6和jsx编译,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.(less|css)?$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader!less-loader"
				})
			},
			{
				test: /\.(jpg|jpeg|gif|bmp|png|webp)?$/i,
				exclude: /(node_modules|bower_components)/,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]'
				}
			},
			{
				test: /\.(woff|woff2|svg|ttf|eot)?$/i,
				exclude: /(node_modules|bower_components)/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			}
		]
	},
	plugins: [
		//html模板插件
		new HtmlWebpackPlugin({
			template: __dirname + '/app/index.html'
		}),
		//定义为生产环境，编译React时压缩到最小
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		//分离CSS和JS文件
		new ExtractTextPlugin('[name].[chunkhash:8].css'),
		//提供公共代码
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: '[name].[chunkhash:8].js'
		}),
		//可在业务js代码中使用__DEV__判断是否是dev模式(dev模式下可以提供错误、测试报告等，production模式不提示)
		new webpack.DefinePlugin({
			__DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV == 'dev') || 'false')
		})
	]
}