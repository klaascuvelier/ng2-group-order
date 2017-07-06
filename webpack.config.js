// Helper: root(), and rootDir() are defined at the bottom
var path = require('path');
var webpack = require('webpack');
var args = process.argv.slice(2);

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        app: './src/bootstrap/bootstrap.ts',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: __dirname + '/dist',
        publicPath: './'
    },
    devServer: {
        //hot: true,
        // inline: true,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.less']
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'app'].reverse(),
            filename: '[name]-[chunkhash:8].js'
        }),

        // Inject paths into html files
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
            hash: true, // inject ?hash at the end of the files
            chunksSortMode: function compare(a, b) {
                // common always first
                if(a.names[0] === 'common') {
                    return -1;
                }
                // app always last
                if(a.names[0] === 'app') {
                    return 1;
                }
                // vendor before app
                if(a.names[0] === 'vendor' && b.names[0] === 'app') {
                    return -1;
                } else {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            sourceMap: true,
            compress: {
                screw_ie8: true,
                dead_code: true
            },
            mangle: {
                screw_ie8: true,
                dead_code: true
            }
        }),

        // Copy assets from the public folder
        // Reference: https://github.com/kevlened/copy-webpack-plugin
        new CopyWebpackPlugin([{
            from: __dirname + '/src/public'
        }])
    ],
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    'angular2-router-loader'
                ]
            },

            {
                test: /\.css$/,
                loader: 'raw-loader'
            },
            {
                test: /\.less$/,
                loader: 'raw-loader!less-loader'
            },
            {
                test: /\.html$/,
                include: /src/,
                loader: 'raw-loader'
            }, {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }, {
                test: /\.svg$/,
                loader: 'file-loader'
            }, {
                test: /\.png$/,
                include: /src/,
                loader: 'file-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }

            // {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=[path][name].[ext]?[hash]'},
            //
            // // Support for *.json files.
            // //{test: /\.json$/, loader: 'json'},
            //
            // // Support for CSS as raw text
            // // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // // all css in src/style will be bundled in an external css file
            // {test: /\.css$/, exclude: root('src','app'), loader: TEST ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')},
            // // all css required in src/app files will be merged in js files
            // {test: /\.css$/, exclude: root('src', 'style'), loader: 'raw!postcss'},
            //
            // // support for .scss files
            // // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // // all css in src/style will be bundled in an external css file
            // {test: /\.scss$/, exclude: root('src', 'app'), loader: TEST ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')},
            // // all css required in src/app files will be merged in js files
            // {test: /\.scss$/, exclude: root('src', 'style'), loader: 'raw!postcss!sass'},
            //
            // // support for .html as raw text
            // // todo: change the loader to something that adds a hash to images
            // {test: /\.html$/, loader: 'raw'}


        ]
    }
};
