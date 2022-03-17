import MyriadAPI from './base';

import {ActivityLogType, BlockedProps, User} from 'src/interfaces/user';

type UserNonceProps = {
  nonce: number;
};

export const getWalletAddress = async (postId: string) => {
  const {data} = await MyriadAPI({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};

export const getUserNonce = async (id: string): Promise<UserNonceProps> => {
  const {data} = await MyriadAPI.request({
    url: `wallets/${id}/nonce`,
    method: 'GET',
  });

  return data ? data : {nonce: 0};
};

export const geUserByWalletAddress = async (address: string): Promise<User & BlockedProps> => {
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
