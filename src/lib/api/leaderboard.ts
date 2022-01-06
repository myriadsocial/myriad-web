import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {User} from 'src/interfaces/user';

type UserList = BaseList<User>;

export const fetchLeaderboard = async (page = 1): Promise<UserList> => {
  const params = {
    filter: {
      order: ['metric.totalKudos DESC'],
      where: {
        'metric.totalKudos': {
          gt: 0,
        },
      },
    },
    pageLimit: PAGINATION_LIMIT,
    pageNumber: page,
  };

  const {data} = await MyriadAPI.request<UserList>({
    url: '/users',
    method: 'GET',
    params,
  });

  return data;
};
