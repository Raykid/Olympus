'use strict';
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev');
const config = require('./config');
const utils = require('./utils');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const env = config.env || 'dev';
let serverConfig = {};

module.exports = async () => {
    switch (env) {
        case 'dev':
            try {
                let location = await utils.intervalPort('localhost', 8080);

                serverConfig = {
                    mode: 'development',
                    devtool: 'source-map',
                    devServer: {
                        historyApiFallback: true,
                        hot: true,
                        host: location.host,
                        port: location.port,
                        open: false,
                        overlay: {
                            warnings: false,
                            errors: true,
                        },
                        proxy: {'/api': 'http://t1.6tiantian.com'},
                        publicPath: '/',
                        quiet: true,
                        watchOptions: {
                            poll: false,
                        },
                    },
                    plugins: [
                        new webpack.HotModuleReplacementPlugin(),
                        new webpack.NamedModulesPlugin(),
                        new webpack.NoEmitOnErrorsPlugin(),
                        new FriendlyErrorsPlugin({
                            compilationSuccessInfo: {
                                messages: [`请访问: http://${ location.host }:${ location.port }`],
                            },
                        }),
                    ],
                };
            } catch (err) {
                console.log(err.msg);
            }
            break;
            
        case 'test':
            // 测试环境使用开发配置
            serverConfig = {
                mode: 'development',
                devtool: 'cheap',
            }
            break;

        default:
            // 发布环境使用发布配置
            serverConfig = {
                mode: 'production',
            };
    }

    return merge(webpackConfig, serverConfig);
};