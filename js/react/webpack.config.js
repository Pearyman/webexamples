var path = require('path');
module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        contentBase: './app',
        port: 8080
    },
    entry: [
        path.resolve(__dirname, 'app/main.jsx'),
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
                test: /\.js[x]$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            //  { test: /\.css$/,loader: 'style-loader!css-loader'},
        ]
    }
};
