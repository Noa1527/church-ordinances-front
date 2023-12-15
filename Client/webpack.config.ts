export const module = {
    rules: [
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [
                                require('tailwindcss'),
                                require('autoprefixer'),
                            ],
                        },
                    },
                },
            ],
        },
    ],
};
  