'use strict';
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

const webpackDevConfig = merge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-source-map'
});

module.exports = webpackDevConfig;