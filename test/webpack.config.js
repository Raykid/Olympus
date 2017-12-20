const webpack = require('webpack');
const path = require('path');


const SRC_PATH = path.resolve(__dirname, '');
const DIST_PATH = path.resolve(__dirname, '');

exports.default = {
    entry: {
        'app': `${SRC_PATH}/main.ts`,
    },

    output: {
        path: DIST_PATH,
        filename: 'main.js',
    },

    resolve: {
        extensions: ['.ts', '.js'],
        // alias: {
        //     "Olympus": 'olympus-r/dist/Olympus.js',
        // },
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                },
            },
        ],
    },

    plugins: [
    ],

    devtool: 'inline-source-map',

}
