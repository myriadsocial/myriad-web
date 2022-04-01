import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {ActivityLogType, BlockedProps, User, UserWallet} from 'src/interfaces/user';

type WalletList = BaseList<UserWallet>;

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

export const connectNetwork = async (payload: ConnectNetwork, id: string): Promise<void> => {
  await MyriadAPI.request({
    url: `users/${id}/wallets`,
    method: 'POST',
    data: payload,
  });
};

export const switchNetwork = async (payload: ConnectNetwork, id: string): Promise<void> => {
  await MyriadAPI.request({
    url: `users/${id}/networks`,
    method: 'PATCH',
    data: payload,
  });
};
