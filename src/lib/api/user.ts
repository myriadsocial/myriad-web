import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {User, ActivityLog, BlockedProps, ActivityLogType} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';

type UserList = BaseList<User>;
type ActivityList = BaseList<ActivityLog>;

export const getUserDetail = async (id: string, userId?: string): Promise<User & BlockedProps> => {
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

  if (userId) {
    params.userId = userId;
  }

  const {data} = await MyriadAPI().request<User & BlockedProps>({
    url: `users/${id}`,
    method: 'GET',
    params,
  });

  return data;
};

export const getUserByAddress = async (address: string[]): Promise<UserList> => {
  const {data} = await MyriadAPI().request<UserList>({
    url: '/users',
    method: 'GET',
    params: {
      pageLimit: address.length,
      filter: {
        where: {
          id: {
            inq: address,
          },
        },
      },
    },
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
    params.filter = {
      where: {
        deletedAt: {
          $exists: false,
        },
      },
    };
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
