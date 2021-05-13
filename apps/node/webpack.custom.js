module.exports = (config, options) => {
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\node.worker\.(c|m)?(j|t)s$/i,
                    use: [
                        {
                            loader: 'worker-loader',
                        },
                        {
                            loader: 'ts-loader',
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            },
                        },
                    ],
                },
            ],
        },
    };
};
