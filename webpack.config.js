const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin-relative');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const GitInfoReplace = require('./info-replace.js');

const SRC = path.resolve(__dirname,'src');
var DIST = path.resolve(__dirname,'build');

const PATHS = {
	app: path.resolve(SRC,'app'),
	www: path.resolve(SRC,'www'),
	less: path.resolve(SRC,'less'),
	dist: DIST
};

const DIST_PATHS = {
	css: 'css',
	images: 'images',
	fonts: 'fonts',
};

GitInfoReplace({filename: path.join(SRC,'buildinfo.json')});

const ProjectName = 'RD-Connect';

const APPS = [
	{
		chunk: 'requestPasswordResetView',
		entrypoint: 'RequestPasswordReset.jsx',
		title: ProjectName + ' request password reset',
	},
	{
		chunk: 'passwordResetView',
		entrypoint: 'PasswordReset.jsx',
		title: ProjectName + ' user password reset',
	},
	{
		chunk: 'confirmEmailView',
		entrypoint: 'ConfirmEmail.jsx',
		title: ProjectName + ' valid e-mail confirmation',
	},
	{
		chunk: 'acceptGDPRView',
		entrypoint: 'AcceptGDPR.jsx',
		title: ProjectName + ' GDPR acceptance',
	},
	{
		chunk: 'desistView',
		entrypoint: 'DesistRequest.jsx',
		title: ProjectName + ' desist request',
	},
];


module.exports = (env, argv) => {
	var optimization;
	var devtool;
	var sourceMap;
	if(argv.mode === 'production') {
		devtool = 'source-map';
		sourceMap =  true;
	} else {
		devtool = false;
		sourceMap = false;
	}
	//if(argv.mode === 'production') {
		// Setting the optimization parameters
		optimization = {
		//	runtimeChunk: true,
//			splitChunks: {
//		//		chunks: 'all',
//				cacheGroups: {
//					vendor: {
//						test: /[\\/]node_modules[\\/]/,
//						name: 'vendors',
//						chunks: 'all'
//					},
//					buildinfo: {
//						test: /[\\/]buildinfo.json/,
//						minSize: 0,
//						priority: 10,
//						name: 'info',
//						chunks: 'all'
//					}
//				}
//			}
		};

	//} else {
	//	optimization = {};
	////	DIST = path.resolve(__dirname,'build-dev');
	////	PATHS.dist = DIST;
	//}
	
	let appsPlugins = APPS.map((app) => {
			return new HtmlWebpackPlugin({
				title: app.title,
				relative: true,
				chunks: [app.chunk],
				template: path.join(PATHS.www,"index.html"),
				filename: path.join(PATHS.dist,app.chunk,"index.html")
			});
	});
	
	let appsCopyCommon = APPS.map((app) => {
		return {
			context: DIST,
			from: 'common/**/*',
			to: DIST + '/' + app.chunk,
		};
	});
	
	let appsEntryCommon = {};
	
	APPS.forEach((app) => {
		appsEntryCommon[app.chunk] = path.join(PATHS.app, app.entrypoint);
	});
	
	return {
		mode: 'development',
		devtool: devtool,
		entry: appsEntryCommon,
		//entry: {
		//	requestPasswordResetView: path.join(PATHS.app, 'RequestPasswordReset.jsx'),
		//	passwordResetView: path.join(PATHS.app, 'PasswordReset.jsx'),
		//	confirmEmailView: path.join(PATHS.app, 'ConfirmEmail.jsx'),
		//	acceptGDPRView: path.join(PATHS.app, 'AcceptGDPR.jsx'),
		//},
		optimization: optimization,
		output: {
			filename: '[id]/[name].[chunkhash].js',
			chunkFilename: '[id]/[name].c.[chunkhash].js',
			path: PATHS.dist
		},
		resolve: {
			modules: [
				PATHS.app,
				PATHS.less,
				path.resolve(__dirname, "node_modules")
			]
		},
		module: {
			rules: [
				{
					enforce: "pre",
					test: /\.jsx?$/,
					include: PATHS.app,
					use: {
						loader: "eslint-loader",
						options: {
							cache: true
						}
					}
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							presets: [
								"@babel/preset-env",
								"@babel/preset-react"
							],
							plugins: [
								'@babel/plugin-transform-runtime'
							],
							sourceMap: sourceMap
						}
					}
				},
				{
					test: /\.less$/,
					use: [
						{ 
							loader: "style-loader",
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: sourceMap
							}
						},
						{
							loader: "less-loader",
							options: {
								paths: [
									PATHS.less,
									path.resolve(__dirname, "node_modules")
								],
								sourceMap: sourceMap
							}
						}
					]
				},
				{
					test: /\.png$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.images,
								limit: 1000
							}
						}
					],
				},
				{
					test: /\.jpg$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.images,
							}
						}
					],
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.fonts,
								mimetype: "application/font-woff"
							}
						}
					],
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.fonts,
								mimetype: "application/octet-stream"
							}
						}
					],
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.fonts,
							}
						}
					],
				},
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: 'common/' + DIST_PATHS.images,
								limit: 1000,
								mimetype: "image/svg+xml"
							}
						}
					],
				},
			]
		},
		plugins: [
			//new HardSourceWebpackPlugin(),
			new webpack.HashedModuleIdsPlugin(),
			//new webpack.ProvidePlugin({
			//// Parts here are needed to have bootstrap working properly
			//	$: 'jquery',
			//	jQuery: 'jquery',
			//	'window.$': 'jquery',
			//	'window.jQuery': 'jquery',
			//}),
			//new CopyWebpackPlugin([
			//		{
			//			context: PATHS.www,
			//			from: 'images/*.svg',
			//			to: DIST
			//		},
			//		{
			//			context: PATHS.www,
			//			from: 'images/*.png',
			//			to: DIST
			//		},
			//		{
			//			context: PATHS.www,
			//			from: 'images/*.jpg',
			//		},
			//		{
			//			context: PATHS.www,
			//			from: 'images/*.ico',
			//			to: DIST
			//		},
			//		//{
			//		//	context: PATHS.app,
			//		//	from: '*.html',
			//		//}
			//]),
			...appsPlugins,
			new CopyWebpackPlugin(appsCopyCommon),
			new WebpackCleanupPlugin()
		]
	};
};
