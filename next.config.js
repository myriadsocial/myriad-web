const ExportEnvPlugin = require('./plugins/export-env');

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/
      },
      use: ['@svgr/webpack']
    });

    config.plugins.push(
      new ExportEnvPlugin({
        filename: 'sw-env.js'
      })
    );

    return config;
  }
};
