
const withTM = require('next-transpile-modules')(['auspice', 'd3-scale']); 

module.exports = withTM({
    webpack: (config, options) => {
        config.module.rules.push({
        test: /\.svg(\?.*)?$/i,
        use: [
            options.defaultLoaders.babel,
            {
            loader: '@svgr/webpack',
            options: {
                svgoConfig: {
                  plugins: [
                    {
                      removeViewBox: false,
                    },
                  ],
                },
              },
            }
        ],
        },
        {
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.json']
              }
        })
    
        return config
    },
});