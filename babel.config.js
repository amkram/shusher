module.exports = function (api) {
    api.cache(true);
  
    const presets = [ '@babel/preset-react', 
        ['@babel/preset-env',
        {
            corejs: false,
            modules: 'commonjs',
            shippedProposals: true,
            targets: { node: '12' },
            exclude: ['transform-typeof-symbol'],
          },
        ]
    ];
    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-transform-runtime'
    ];

    return {
      presets, plugins
    };
  }