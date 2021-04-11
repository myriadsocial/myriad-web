//const withTM = require('next-transpile-modules')([
//'@polkadot/api',
//'@polkadot/api-derive',
//'@polkadot/extension-dapp',
//'@polkadot/hw-ledger',
//'@polkadot/hw-ledger-transports',
//'@polkadot/keyring',
//'@polkadot/metadata',
//'@polkadot/networks',
//'@polkadot/rpc-core',
//'@polkadot/rpc-core',
//'@polkadot/rpc-provider',
////'@polkadot/ts',
//'@polkadot/types',
//'@polkadot/types-known',
//'@polkadot/ui-keyring',
//'@polkadot/ui-settings',
//'@polkadot/util',
//'@polkadot/util-crypto',
//'@polkadot/wasm-crypto',
//'@polkadot/x-fetch',
//'@polkadot/x-global',
//'@polkadot/x-rxjs',
//'@polkadot/x-ws'
//]);
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
