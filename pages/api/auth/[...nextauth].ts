import { AnyObject } from '@udecode/plate';

import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';

import APIAdapter from 'adapters/api';
import { NetworkIdEnum } from 'src/interfaces/network';
import { LoginType, SignInCredential } from 'src/interfaces/session';
import { WalletTypeEnum } from 'src/interfaces/wallet';
import * as AuthLinkAPI from 'src/lib/api/auth-link';
import initialize from 'src/lib/api/base';
import * as AuthAPI from 'src/lib/api/ext-auth';
import { encryptMessage } from 'src/lib/crypto';
import { credentialToSession } from 'src/lib/serializers/session';

const { serverRuntimeConfig } = getConfig();

const createOptions = (req: NextApiRequest) => ({
  // used when session strategy is database
  adapter: APIAdapter(),
  // https://next-auth.js.org/configuration/providers
  providers: [
    CredentialsProvider({
      id: 'credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Wallet Credential',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        address: { label: 'Address', type: 'text' },
        signature: { label: 'Wallet Signature', type: 'text' },
        nonce: { label: 'Nonce', type: 'text' },
        walletType: { label: 'Wallet Type', type: 'text' },
        networkType: { label: 'Network ID', type: 'text' },
        publicAddress: { label: 'Public Address', type: 'text' },
        instanceURL: { label: 'Instance url', type: 'text' },
        blockchainPlatform: { label: 'Blockchain Platform', type: 'text' },
      },
      async authorize(credentials) {
        // Initialize instance api url
        initialize({ apiURL: credentials.instanceURL });

        if (!credentials?.signature) throw Error('no signature!');

        const data = await AuthAPI.login({
          nonce: Number(credentials.nonce),
          signature: credentials.signature,
          publicAddress: credentials.publicAddress,
          walletType: credentials.walletType as WalletTypeEnum,
          networkType: credentials.networkType as NetworkIdEnum,
        });

        if (!data?.token?.accessToken) throw Error('Failed to authorize user!');

        try {
          // Any object returned will be saved in `user` property of the JWT
          const user = data.user;
          const accessToken = data.token.accessToken;
          const payload = encryptMessage(accessToken, user.username);
          const signInCredential = parseCredential(
            user,
            credentials,
            LoginType.WALLET,
          );

          return credentialToSession(signInCredential, payload);
        } catch (error) {
          // If failed, use instance url from session
          initialize({ cookie: req.headers.cookie });

          console.log('[api][Auth]', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'emailCredentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Email Credential',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: 'Email', type: 'text' },
        token: { label: 'Token', type: 'text' },
        instanceURL: { label: 'Instance url', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) throw Error('no token!');

        // Initialize instance api url
        initialize({ apiURL: credentials.instanceURL });

        const data = await AuthLinkAPI.loginWithLink(credentials.token);

        if (!data?.token?.accessToken) throw Error('Failed to authorize user!');

        try {
          const user = data.user;
          const accessToken = data.token.accessToken;
          const payload = encryptMessage(accessToken, user.username);
          const signInCredential = parseCredential(
            user,
            credentials,
            LoginType.EMAIL,
          );

          // Any object returned will be saved in `user` property of the JWT
          return credentialToSession(signInCredential, payload);
        } catch (error) {
          // If failed, use instance url from session
          initialize({ cookie: req.headers.cookie });

          console.log('[api][Auth]', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'tokenCredentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Token Credential',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        token: { label: 'Token', type: 'text' },
        rpcUrl: { label: 'rpc url', type: 'text' },
        instanceURL: { label: 'Instance url', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) throw Error('no token!');

        // Initialize instance api url
        initialize({ apiURL: credentials.instanceURL });

        const data = await AuthLinkAPI.loginWithAccessToken(credentials.token, credentials.rpcUrl);

        if (!data?.token?.accessToken) throw Error('Failed to authorize user!');

        try {
          const user = data.user;
          const accessToken = data.token.accessToken;
          const payload = encryptMessage(accessToken, user.username);
          const signInCredential = parseCredential(
            user,
            credentials,
            LoginType.WALLET,
          );

          // Any object returned will be saved in `user` property of the JWT
          return credentialToSession(signInCredential, payload);
        } catch (error) {
          // If failed, use instance url from session
          initialize({ cookie: req.headers.cookie });

          console.log('[api][Auth]', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'updateSession',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Update Credential',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {},
      async authorize(credentials) {
        // Initialize instance api url
        return credentials;
      },
    }),
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must to install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  // database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: serverRuntimeConfig.appSecret,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt' as const,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: serverRuntimeConfig.appSecret,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/login', // Displays signin buttons
    signOut: '/login', // Displays form with sign out button
    error: '/', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) { return true },
    // async redirect(url, baseUrl) { return baseUrl },
    async session({ session, user, token }) {
      // The return type will match the one returned in `useSession()`
      return {
        ...session,
        user: token,
      } as Session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token = {
          ...token,
          // User detail
          id: user.id,
          username: user.username,
          email: user.email,
          address: user.address,

          // Login detail
          token: user.token,
          instanceURL: user.instanceURL,
          loginType: user.loginType,

          // Blockchain detail
          walletType: user.walletType,
          networkType: user.networkType,
          blockchainPlatform: user.blockchainPlatform,
          gaga: user.gaga,
        };
      }

      return token;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.log(code, message);
    },
  },
});

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, createOptions(req));
};

export default auth;

export function parseCredential(
  user: Partial<AuthAPI.User>,
  credentials: AnyObject,
  loginType: LoginType,
): SignInCredential {
  return {
    // User detail
    id: user.id,
    username: user.username,
    email: user.email,
    address: user.address,

    // Login detail
    instanceURL: credentials.instanceURL,
    loginType,

    // Blockchain detail
    walletType: credentials?.walletType ?? '',
    networkType: credentials?.networkType ?? '',
    blockchainPlatform: credentials?.blockchainPlatform ?? '',
  };
}
