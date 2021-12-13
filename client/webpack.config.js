var path = require('path');

module.exports = {
    entry: './src/index.ts',
	mode: "production",

    target: "node",
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
	preferRelative: true
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/
            }
        ]
    },
}
