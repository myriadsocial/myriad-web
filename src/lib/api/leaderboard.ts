import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {User} from 'src/interfaces/user';

type UserList = BaseList<User>;

export const fetchLeaderboard = async (): Promise<UserList> => {
  const params = {
    filter: {
      order: ['totalActivity DESC'],
    },
    pageLimit: 1000,
  };

  const {data} = await MyriadAPI.request<UserList>({
    url: '/leader-boards',
    method: 'GET',
    params,
  });

  return data;
};
