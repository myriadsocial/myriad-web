import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {User, ActivityLog, FriendStatusProps} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';

type UserList = BaseList<User>;
type ActivityList = BaseList<ActivityLog>;

export const getUserDetail = async (
  userNameOrId: string,
  userId?: string,
): Promise<User & {friendInfo: FriendStatusProps}> => {
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
        {
          relation: 'accountSetting',
        },
      ],
    },
  };

  if (userId) {
    params.userId = userId;
  }

  const {data} = await MyriadAPI().request<User & {friendInfo: FriendStatusProps}>({
    url: `/users/${userNameOrId}`,
    method: 'GET',
    params,
  });

  return data;
};

export const updateUser = async (userId: string, values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI().request<User>({
    url: `/user/me`,
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
    url: `/users/username/${username}`,
    method: 'GET',
  });

  return data.status;
};

export const getWalletAddress = async (userId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI().request<WalletDetail>({
    url: `/walletaddress/user/${userId}`,
    method: 'GET',
  });

  return data;
};

export const getCheckEmail = async (email: string): Promise<boolean> => {
  const {data} = await MyriadAPI().request<{status: boolean}>({
    url: `/users/email/${email}`,
    method: 'GET',
  });
  return data.status;
};

export const getCountPost = async (): Promise<{count: number}> => {
  const {data} = await MyriadAPI().request<{count: number}>({
    url: `/user/posts/action`,
    method: 'GET',
  });
  return data;
};
