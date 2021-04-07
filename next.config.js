//const withTM = require('next-transpile-modules')(['@polkadot/*']);
//module.exports = withTM({
//webpack(config) {
//config.module.rules.push({
//test: /\.svg$/,
//issuer: {
//test: /\.(js|ts)x?$/
//},
//use: ['@svgr/webpack']
//});

//return config;
//}
//});
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/
      },
      use: ['@svgr/webpack']
    });

    return config;
  }
};
