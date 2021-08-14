import MyriadAPI from './base';

import {Notification} from 'src/interfaces/notification';

export const getNotification = async (userId: string): Promise<Notification[]> => {
  const {data} = await MyriadAPI.request<Notification[]>({
    url: `/notifications`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{to: userId}],
        },
        include: ['from', 'to'],
      },
    },
  });

  return data;
};
