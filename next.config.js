/* eslint-disable @typescript-eslint/no-var-requires */
const {withSentryConfig} = require('@sentry/nextjs');
const {version} = require('./package.json');

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    } else {
      return version;
    }
  },
  future: {
    webpack5: false,
  },
  experimental: {
    reactRefresh: true,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    appSecret: process.env.SECRET ?? 'd98b4af078b46a9984829a72030976e0',
    myriadAPIURL: process.env.MYRIAD_API_URL ?? 'http://localhost:3001',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    appEnvironment: process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? 'local',
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? `Myriad Local`,
    appVersion: `v${process.env.NEXT_PUBLIC_APP_VERSION ?? version}`,
    appAuthURL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    myriadWebsiteURL: process.env.NEXT_PUBLIC_MYRIAD_WEBSITE_URL ?? 'https://www.myriad.social',
    myriadSupportMail: process.env.NEXT_PUBLIC_MYRIAD_SUPPORT_MAIL ?? 'support@myriad.social',
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseAPIKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'myriad-social-development',
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
