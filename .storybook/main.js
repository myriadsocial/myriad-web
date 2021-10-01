const path = require('path');

const AppSourceDir = path.join(__dirname, '..', 'src/images');

module.exports = {
  typescript: {
    check: true,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async baseConfig => {
    const rules = baseConfig.module.rules;

    // modify storybook's file-loader rule to avoid conflicts with svgr
    const fileLoaderRule = rules.find(rule => rule.test.test('.svg'));
    fileLoaderRule.exclude = [AppSourceDir];

    rules.push({
      test: /\.mjs$/,
      include: [path.join(__dirname, '..', 'node_modules/@polkadot/extension-dapp/')],
      type: 'javascript/auto',
    });

    rules.push({
      test: /\.svg$/,
      include: [AppSourceDir],
      use: ['@svgr/webpack'],
    });

    baseConfig.resolve.alias['src'] = path.resolve(__dirname, '../src/');

    return baseConfig;
  },
};
