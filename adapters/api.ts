import {AppOptions, User} from 'next-auth';
import {Session, AdapterInstance} from 'next-auth/adapters';
import jwt from 'next-auth/jwt';
import getConfig from 'next/config';

import axios from 'axios';
import {isErrorWithMessage} from 'src/helpers/error';
import {SocialsEnum} from 'src/interfaces/social';
import * as PeopleAPI from 'src/lib/api/people';
import * as WalletAPI from 'src/lib/api/wallet';
import {userToSession} from 'src/lib/serializers/session';

const {serverRuntimeConfig} = getConfig();

//@ts-ignore
function Adapter() {
  async function getAdapter(appOptions: AppOptions): Promise<AdapterInstance<any, any, any, any>> {
    // Display debug output if debug option enabled
    function _debug(...args: Array<any>) {
      if (appOptions.debug) {
        console.log('[next-auth][adapter][debug]', ...args);
      }
    }

    async function createUser(profile: any) {
      _debug('createUser', profile);
      return null;
    }

    async function getUser(address: string) {
      try {
        const user = await WalletAPI.getUserByWalletAddress(address);

        _debug('getUser', address, user);

        return userToSession(user, address);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          _debug('getUser error', error.response?.data);
        } else if (isErrorWithMessage(error)) {
          _debug('getUser error', error.message);
        }

        return Promise.reject(error);
      }
    }

    async function getUserByEmail(email: string) {
      _debug('getUserByEmail', email);
      return null;
    }

    async function getUserByProviderAccountId(providerId: SocialsEnum, providerAccountId: string) {
      const people = await PeopleAPI.getPeopleByPlatform(providerId, providerAccountId);

      if (people) {
        _debug('getUserByProviderAccountId data', people);
      } else {
        _debug('getUserByProviderAccountId not found');
      }

      return null;
    }

    async function updateUser(user: any) {
      _debug('updateUser', user);
      return null;
    }

    async function linkAccount(
      userId: string,
      providerId: SocialsEnum,
      providerType: string,
      providerAccountId: string,
    ): Promise<void> {
      _debug('Adapter linkAccount', userId, providerId, providerType, providerAccountId);
    }

    async function createSession(user: User) {
      _debug('createSession', user);
      return null;
    }

    async function getSession(sessionToken: string) {
      _debug('getSession', sessionToken);

      try {
        const session = jwt.decode({
          token: sessionToken,
          secret: serverRuntimeConfig.appSecret,
        });

        _debug('decoded session', session);

        return session;
      } catch (error) {
        if (isErrorWithMessage(error)) {
          _debug('decoded session error', error);
        }

        return null;
      }
    }

    async function updateSession(session: Session, force: boolean) {
      _debug('updateSession', session);
      return null;
    }

    async function deleteSession(sessionToken: string): Promise<void> {
      _debug('deleteSession', sessionToken);
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
      deleteSession,
    };
  }

  return {
    getAdapter,
  };
}

export default {
  Adapter,
};
