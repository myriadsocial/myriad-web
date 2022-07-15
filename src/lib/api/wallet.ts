import {isHex} from '@polkadot/util';

import MyriadAPI from './base';
import {AccountRegisteredError} from './errors/account-registered.error';
import {BaseList} from './interfaces/base-list.interface';
import {BaseErrorResponse} from './interfaces/error-response.interface';

import axios, {AxiosError} from 'axios';
import {Network} from 'src/interfaces/network';
import {BlockedProps, User, UserWallet, Wallet} from 'src/interfaces/user';

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

export interface ServerMetric {
  totalPosts: number;
  totalUser: number;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  metric: ServerMetric;
  categories: string[];
  accountId?: any;
}

export const getUserNonce = async (id: string): Promise<UserNonceProps> => {
  const address = isHex(`0x${id}`) ? `0x${id}` : id;
  const {data} = await MyriadAPI().request({
    url: `wallets/${address}/nonce`,
    method: 'GET',
  });

  return data ? data : {nonce: 0};
};

export const getUserByWalletAddress = async (address: string): Promise<User & BlockedProps> => {
  const addr = isHex(`0x${address}`) ? `0x${address}` : address;
  const params: Record<string, any> = {
    filter: {
      include: [
        {
          relation: 'wallets',
          scope: {
            include: [{relation: 'network'}],
            where: {
              primary: true,
            },
          },
        },
      ],
    },
  };

  const {data} = await MyriadAPI().request<User & BlockedProps>({
    url: `wallets/${addr}/user`,
    method: 'GET',
    params,
  });

  return data;
};

export const getCurrentUserWallet = async (): Promise<UserWallet> => {
  const {data} = await MyriadAPI().request({
    url: `/wallet`,
    method: 'GET',
  });

  return data;
};

export const getUserWallets = async (userId: string): Promise<WalletList> => {
  const {data} = await MyriadAPI().request({
    url: `/users/${userId}/wallets`,
    method: 'GET',
    params: {
      filter: {
        include: ['network'],
      },
    },
  });

  return data;
};

export const getUserNonceByUserId = async (id: string): Promise<UserNonceProps> => {
  const {data} = await MyriadAPI().request({
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
    const {data} = await MyriadAPI().request<Wallet>({
      url: `users/${id}/wallets`,
      method: 'POST',
      data: payload,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const {response} = error as AxiosError<BaseErrorResponse>;

      if (response.data.error.name === 'UnprocessableEntityError') {
        throw new AccountRegisteredError(response.data.error);
      }
    }

    return null;
  }
};

export const switchNetwork = async (payload: ConnectNetwork, id: string): Promise<any> => {
  try {
    const data = await MyriadAPI().request({
      url: `users/${id}/networks`,
      method: 'PATCH',
      data: payload,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const {response} = error as AxiosError<BaseErrorResponse>;

      if (response.data.error.name === 'UnprocessableEntityError') {
        throw new AccountRegisteredError(response.data.error);
      }
    } else {
      throw error;
    }
  }
};

export const getNetworks = async (): Promise<Networks> => {
  const {data} = await MyriadAPI().request({
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

export const getServer = async (): Promise<Server> => {
  const {data} = await MyriadAPI().request<Server>({
    url: `/server`,
    method: 'GET',
  });

  return data;
};

export const getAccountIdMyria = async (networkId?: string): Promise<string> => {
  const {data} = await MyriadAPI().request<Server>({
    url: `/server`,
    method: 'GET',
  });

  return data.accountId.myriad;
};

export const claimReference = async ({
  txFee,
  tippingContractId,
}: {
  txFee: string;
  tippingContractId?: string;
}) => {
  try {
    const {data} = await MyriadAPI().request({
      url: '/claim-references',
      method: 'POST',
      data: {txFee, tippingContractId},
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const {response} = error as AxiosError<BaseErrorResponse>;

      if (response.data.error.name === 'UnprocessableEntityError') {
        throw new Error(response.data.error.message);
      }
    }

    return null;
  }
};
