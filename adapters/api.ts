import { AppOptions, User } from 'next-auth';
import { Session, AdapterInstance } from 'next-auth/adapters';
import jwt from 'next-auth/jwt';

import Axios from 'axios';
import snoowrap from 'snoowrap';
import { TwitterClient } from 'twitter-api-client';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ''
});

const FacebookGraph = Axios.create({
  baseURL: 'https://graph.facebook.com'
});

//@ts-ignore
function Adapter() {
  async function getAdapter(appOptions: AppOptions): Promise<AdapterInstance<any, any, any, any>> {
    // Display debug output if debug option enabled
    function _debug(...args: Object[]) {
      if (appOptions.debug) {
        console.log('[next-auth][debug]', ...args);
      }
    }

    async function createUser(profile: any) {
      _debug('Adapter createUser', profile);
      return null;
    }

    async function getUser(id: string) {
      const { data } = await MyriadAPI({
        url: `users/${id}`,
        method: 'GET'
      });

      _debug('Adapter getUser', id, data);

      return {
        ...data,
        userId: data.id,
        anonymous: false
      };
    }

    async function getUserByEmail(email: string) {
      _debug('Adapter getUserByEmail', email);
      return null;
    }

    async function getUserByProviderAccountId(providerId: string, providerAccountId: string) {
      const { data } = await MyriadAPI({
        url: `/people`,
        method: 'GET',
        params: {
          filter: {
            limit: 1,
            where: {
              platform: {
                eq: providerId
              },
              id: {
                eq: providerAccountId
              }
            }
          }
        }
      });

      _debug('Adapter getUserByProviderAccountId data', providerId, data);
      return null;
    }

    async function updateUser(user: any) {
      _debug('Adapter updateUser', user);
      return null;
    }

    async function linkAccount(
      userId: string,
      providerId: string,
      providerType: string,
      providerAccountId: string,
      refreshToken: string,
      accessToken: string,
      accessTokenExpires: number
    ): Promise<void> {
      let username = '';

      switch (providerId) {
        case 'twitter':
          const twitterClient = new TwitterClient({
            apiKey: process.env.TWITTER_API_KEY || '',
            apiSecret: process.env.TWITTER_API_KEY_SECRET || '',
            accessToken: accessToken,
            accessTokenSecret: refreshToken
          });

          const twitterProfile = await twitterClient.accountsAndUsers.accountVerifyCredentials({
            include_entities: false
          });

          username = twitterProfile.name;
          break;
        case 'facebook':
          const { data: facebookProfile } = await FacebookGraph({
            url: '/v10.0/me',
            params: {
              access_token: accessToken,
              fields: 'id,name'
            }
          });

          username = facebookProfile.name;
          break;
        case 'reddit':
          const reddit = new snoowrap({
            userAgent: 'myriad',
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_SECRET,
            accessToken
          });

          //@ts-ignore
          const redditProfile = await reddit.getMe();

          username = redditProfile.name;
          break;
      }

      const { data: people } = await MyriadAPI({
        url: `/people`,
        method: 'POST',
        data: {
          platform: providerId,
          platform_account_id: providerAccountId,
          username
        }
      });

      await MyriadAPI({
        url: `/people/${people.id}/user-credential`,
        method: 'POST',
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          userId
        }
      });

      _debug('Adapter linkAccount', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);
    }

    async function createSession(user: User) {
      _debug('Adapter createSession', user);
      return null;
    }

    async function getSession(sessionToken: string) {
      _debug('Adapter getSession', sessionToken);

      try {
        const session = jwt.decode({
          token: sessionToken,
          secret: process.env.SECRET || ''
        });

        _debug('Adapter decoded session', session);

        return session;
      } catch (error) {
        _debug('Adapter decoded error', error);

        return null;
      }
    }

    async function updateSession(session: Session, force: boolean) {
      _debug('Adapter updateSession', session);
      return null;
    }

    async function deleteSession(sessionToken: string): Promise<void> {
      _debug('Adapter deleteSession', sessionToken);
    }

    return {
      createUser,
      getUser,
      getUserByEmail,
      getUserByProviderAccountId,
      updateUser,
      linkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession
    };
  }

  return {
    getAdapter
  };
}

export default {
  Adapter
};
