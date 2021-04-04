import { AppOptions, User } from 'next-auth';
import { Session, AdapterInstance } from 'next-auth/adapters';
import jwt from 'next-auth/jwt';

import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ''
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
      const { data } = await axios({
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
      const { data } = await axios({
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
      _debug('Adapter getUserByProviderAccountId', providerId, providerAccountId);
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
      //   const { data: people } = await axios({
      //     url: `/people`,
      //     method: 'POST',
      //     data: {
      //       id: providerId,
      //       platform: providerType,
      //       username: ''
      //     }
      //   });

      //   await axios({
      //     url: `/user/${userId}/user-credentials`,
      //     method: 'POST',
      //     data: {
      //       token: accessToken,
      //       people_id: people.id,
      //       userId
      //     }
      //   });

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
