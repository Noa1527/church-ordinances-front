module.exports = {
    module: {
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
    },
    // Ajoutez ici d'autres configurations de Webpack si nécessaire
};
// export const module = {
//     rules: [
//         {
//             test: /\.css$/,
//             use: [
//                 {
//                     loader: 'postcss-loader',
//                     options: {
//                         postcssOptions: {
//                             ident: 'postcss',
//                             plugins: [
//                                 require('tailwindcss'),
//                                 require('autoprefixer'),
//                             ],
//                         },
//                     },
//                 },
//             ],
//         },
//     ],
// };
  