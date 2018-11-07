'use strict';
const path = require('path');
const buildConfig = require('./config');


const webpackConfig = {
    entry: buildConfig.entry,

    output: {
        filename: '[name].js',
        chunkFilename: 'bundle-[name].[chunkhash:10].js',
        path: path.join(__dirname, '../', buildConfig.distPath),
    },

    resolve: {
        extensions: ['.js', '.ts'],
    },

    externals: {
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html?$/,
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'link:href'],
                    removeComments: true
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')(),
                                require('cssnano')(),
                            ],
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'assets/[name]-[hash:10].[ext]',
                    limit: 81920,
                },
            },
            {
                test: /\.[jt]sx?$/,
                use: 'olympus-r-module-splitter',
                exclude: /node_modules/
            }
        ]
    },

    // 这个用来关闭webpack警告建议 T_T
    performance: {
        hints: false,
    },
};

module.exports = webpackConfig;
