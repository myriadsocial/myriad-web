import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {User, UserTransactionDetail, ActivityLog} from 'src/interfaces/user';

type UserList = BaseList<User>;
type ActivityList = BaseList<ActivityLog>;

export const getUserDetail = async (id: string): Promise<User> => {
  const {data} = await MyriadAPI.request<User>({
    url: `users/${id}`,
    method: 'GET',
    params: {
      filter: {
        include: ['currencies'],
      },
    },
  });

  return data;
};

export const getUserByAddress = async (address: string[]): Promise<User[]> => {
  const {data} = await MyriadAPI.request<User[]>({
    url: '/users',
    method: 'GET',
    params: {
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

export const createUser = async (values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI.request<User>({
    url: '/users',
    method: 'POST',
    data: values,
  });

  return data;
};

export const updateUser = async (userId: string, values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI.request<User>({
    url: `/users/${userId}`,
    method: 'PATCH',
    data: values,
  });

  return data;
};

export const search = async (query: string): Promise<UserList> => {
  const {data} = await MyriadAPI.request<UserList>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          name: {
            like: `${query}.*`,
            options: 'i',
          },
        },
      },
    },
  });

  return data;
};

export const getUserTransactionDetail = async (id: string): Promise<UserTransactionDetail> => {
  const {data} = await MyriadAPI.request<UserTransactionDetail>({
    url: `/users/${id}/transaction-summary`,
    method: 'GET',
  });

  return data;
};

export const searchUsername = async (query: string): Promise<UserList> => {
  const {data} = await MyriadAPI.request<UserList>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          username: query,
        },
      },
    },
  });

  return data;
};

export const checkUsername = async (userId: string): Promise<ActivityList> => {
  const {data} = await MyriadAPI.request<ActivityList>({
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
