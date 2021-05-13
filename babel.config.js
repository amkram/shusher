module.exports = function (api) {
  api.cache(true);

  const presets = [  ];
  const plugins = [  [
    require('@babel/plugin-proposal-decorators').default,
    {
      legacy: true
    }
  ], ];

  return {
    presets,
    plugins
  };
}