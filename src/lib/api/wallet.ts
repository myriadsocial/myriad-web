import MyriadAPI from './base';
import {AccountRegisteredError} from './errors/account-registered.error';
import {BaseList} from './interfaces/base-list.interface';

import axios from 'axios';
import {ActivityLogType, BlockedProps, User, UserWallet, Wallet} from 'src/interfaces/user';
import {Network} from 'src/interfaces/wallet';

type WalletList = BaseList<UserWallet>;
type Networks = BaseList<Network>;

type UserNonceProps = {
  nonce: number;
};

export type ConnectNetwork = {
  publicAddress: string;
  nonce: number;
  signature: string | null;
  networkType: string;
  walletType: string;
  data?: {
    id: string;
  };
};

export const getUserNonce = async (id: string): Promise<UserNonceProps> => {
  const {data} = await MyriadAPI.request({
    url: `wallets/${id}/nonce`,
    method: 'GET',
  });

  return data ? data : {nonce: 0};
};

export const getUserByWalletAddress = async (address: string): Promise<User & BlockedProps> => {
  const params: Record<string, any> = {
    filter: {
      include: [
        {
          relation: 'currencies',
          scope: {
            order: 'priority ASC',
          },
        },
        {
          relation: 'people',
        },
        {
          relation: 'activityLogs',
          scope: {
            where: {
              type: {
                inq: [ActivityLogType.SKIP, ActivityLogType.USERNAME],
              },
            },
          },
        },
        {
          relation: 'wallets',
          scope: {
            where: {
              primary: true,
            },
          },
        },
      ],
    },
  };

  const {data} = await MyriadAPI.request<User & BlockedProps>({
    url: `wallets/${address}/user`,
    method: 'GET',
    params,
  });

  return data;
};

export const getCurrentUserWallet = async (): Promise<UserWallet> => {
  const {data} = await MyriadAPI.request({
    url: `/wallet`,
    method: 'GET',
  });

  return data;
};

export const getUserWallets = async (userId: string): Promise<WalletList> => {
  const {data} = await MyriadAPI.request({
    url: `/users/${userId}/wallets`,
    method: 'GET',
  });

  return data;
};

export const getUserNonceByUserId = async (id: string): Promise<UserNonceProps> => {
  const {data} = await MyriadAPI.request({
    url: `users/${id}/nonce`,
    method: 'GET',
  });

  return data ? data : {nonce: 0};
};

export const connectNetwork = async (
  payload: ConnectNetwork,
  id: string,
): Promise<Wallet | null> => {
  try {
    const {data} = await MyriadAPI.request<Wallet>({
      url: `users/${id}/wallets`,
      method: 'POST',
      data: payload,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (data?.error?.name === 'UnprocessableEntityError') {
        throw new AccountRegisteredError(data?.error?.message ?? 'Failed to connect wallet');
      }
    }

    return null;
  }
};

export const switchNetwork = async (payload: ConnectNetwork, id: string): Promise<void> => {
  await MyriadAPI.request({
    url: `users/${id}/networks`,
    method: 'PATCH',
    data: payload,
  });
};

export const getNetworks = async (): Promise<Networks> => {
  const {data} = await MyriadAPI.request({
    url: `/networks`,
    method: 'GET',
    params: {
      filter: {
        include: [
          {
            relation: 'currencies',
            scope: {
              order: 'priority ASC',
            },
          },
        ],
      },
    },
  });

  return data;
};
