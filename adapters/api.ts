import {Account} from 'next-auth';
import type {Adapter, AdapterSession, AdapterUser, VerificationToken} from 'next-auth/adapters';
import jwt from 'next-auth/jwt';
import getConfig from 'next/config';

import axios from 'axios';
import {isErrorWithMessage} from 'src/helpers/error';
import {NetworkIdEnum} from 'src/interfaces/network';
import * as AuthAPI from 'src/lib/api/ext-auth';
import * as WalletAPI from 'src/lib/api/wallet';

const {serverRuntimeConfig} = getConfig();

export default function APIAdapter(): Adapter {
  function _debug(...args: Array<any>) {
    console.debug('[next-auth][adapter]', ...args);
  }

  return {
    async createUser(user: Omit<AdapterUser, 'id'>) {
      _debug('createUser', user);

      await AuthAPI.signUp({
        name: '',
        username: '',
        address: '',
        network: NetworkIdEnum.MYRIAD,
      });

      return user as AdapterUser;
    },

    async getUser(address: string): Promise<AdapterUser | null> {
      _debug('getUser', address);

      try {
        const user = await WalletAPI.getUser();

        return {id: user.id} as AdapterUser;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          _debug('getUser error', error.response?.data);
        } else if (isErrorWithMessage(error)) {
          _debug('getUser error', error.message);
        }

        return null;
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      _debug('getUserByEmail', email);

      return null;
    },

    async getUserByAccount(
      account: Pick<Account, 'provider' | 'providerAccountId'>,
    ): Promise<AdapterUser | null> {
      _debug('getUserByAccount', account);

      return null;
    },

    async updateUser(user): Promise<AdapterUser> {
      _debug('updateUser', user);

      return {} as AdapterUser;
    },

    async deleteUser(userId): Promise<void> {
      _debug('deleteUser', userId);
    },

    async linkAccount(account): Promise<void> {
      _debug('linkAccount', account);
    },

    async unlinkAccount(account: Pick<Account, 'provider' | 'providerAccountId'>): Promise<void> {
      _debug('unlinkAccount', account);
    },

    async createSession({sessionToken, userId, expires}): Promise<AdapterSession> {
      _debug('createSession', sessionToken, userId, expires);

      return {} as AdapterSession;
    },

    async getSessionAndUser(sessionToken): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      try {
        const session = await jwt.decode({
          token: sessionToken,
          secret: serverRuntimeConfig.appSecret,
        });

        _debug('decoded session', session);

        return null;
      } catch (error) {
        if (isErrorWithMessage(error)) {
          _debug('decoded session error', error);
        }

        return null;
      }
    },

    async updateSession({sessionToken}): Promise<AdapterSession | null> {
      _debug('updateSession', sessionToken);

      return null;
    },

    async deleteSession(sessionToken): Promise<void> {
      _debug('updateSession', sessionToken);
    },

    async createVerificationToken({identifier, expires, token}): Promise<VerificationToken | null> {
      _debug('createVerificationToken', identifier, expires, token);

      return null;
    },

    async useVerificationToken({identifier, token}): Promise<VerificationToken | null> {
      _debug('createVerificationToken', identifier, token);

      return null;
    },
  };
}
