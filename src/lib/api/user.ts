import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {User, ActivityLog, FriendStatusProps} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';

type UserList = BaseList<User>;
type ActivityList = BaseList<ActivityLog>;

export const getUserDetail = async (
  id: string,
  userId?: string,
): Promise<User & FriendStatusProps> => {
  const params: Record<string, any> = {
    filter: {
      include: [
        {
          relation: 'people',
        },
        {
          relation: 'wallets',
          scope: {
            include: [
              {
                relation: 'network',
              },
            ],
          },
        },
      ],
    },
  };

  if (userId) {
    params.userId = userId;
  }

  const {data} = await MyriadAPI().request<User & FriendStatusProps>({
    url: `users/${id}`,
    method: 'GET',
    params,
  });

  return data;
};

export const updateUser = async (userId: string, values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI().request<User>({
    url: `/users/${userId}`,
    method: 'PATCH',
    data: values,
  });

  return data;
};

export const searchUsers = async (page = 1, query?: string): Promise<UserList> => {
  const params: Record<string, any> = {
    pageNumber: page,
    pageLimit: PAGINATION_LIMIT,
  };

  if (query) {
    params.name = query;
    params.sortBy = 'name';
    params.order = 'ASC';
  }

  const {data} = await MyriadAPI().request<UserList>({
    url: '/users',
    method: 'GET',
    params,
  });

  return data;
};

export const checkUsername = async (userId: string): Promise<ActivityList> => {
  const {data} = await MyriadAPI().request<ActivityList>({
    url: '/activity-logs',
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{type: 'username'}, {userId}],
        },
      },
    },
  });

  return data;
};

export const getUsername = async (username: string): Promise<boolean> => {
  const {data} = await MyriadAPI().request({
    url: `/username/${username}`,
    method: 'GET',
  });

  return data;
};

export const getWalletAddress = async (userId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI().request<WalletDetail>({
    url: `/users/${userId}/walletaddress`,
    method: 'GET',
  });

  return data;
};

export const getCheckEmail = async (email: string): Promise<boolean> => {
  const {data} = await MyriadAPI().request<boolean>({
    url: `/email/${email}`,
    method: 'GET',
  });
  return data;
};

export const getCountPost = async (): Promise<{count: number}> => {
  const {data} = await MyriadAPI().request<{count: number}>({
    url: `/posts/action`,
    method: 'GET',
  });
  return data;
};
