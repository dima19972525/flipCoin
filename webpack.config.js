const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, './src/index.js'),

    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build'),
        libraryTarget: 'var',
        library: 'Model',
    },
    devServer: {
        contentBase: './build',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './index.html'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(obj|stl|fbx|jpg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
};
