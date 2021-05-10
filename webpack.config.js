const src = '/src';
const assembly = '/assembly';
const wasm = '/wasm';

module.exports = {
    devtool: 'source-map',
    entry: './dist/main.js',
    // output: './dist/bundle.js',
    resolve: {
        extensions: ['.js', '.wasm', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [src],
                loader: 'ts-loader',
                options: {
                    configFileName: './tsconfig.json',
                },
            },
            {
                test: /\.ts$/,
                include: [assembly],
                loader: 'ts-loader',
                options: {
                    configFileName: './tsconfig.assembly.json',
                },
            },
            // {
            //     test: /\.ts$/,
            //     include: [wasm],
            //      loader: 'ts-loader',
            //     options: {
            //         instance: 'service-worker',
            //     },
            // },
        ],
    },
    output: {
        filename: './dist/bundle/bundle.js',
        library: 'bundle',
        libraryTarget: 'umd',
    },

    mode: 'production',
};
