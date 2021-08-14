import MyriadAPI from './base';

import {Notification, TotalNewNotification} from 'src/interfaces/notification';

export const getNotification = async (userId: string): Promise<Notification[]> => {
  const {data} = await MyriadAPI.request<Notification[]>({
    url: `/notifications`,
    method: 'GET',
    params: {
      filter: {
        order: `createdAt DESC`,
        where: {
          and: [{to: userId}],
        },
        include: ['from', 'to'],
      },
    },
  });

  return data;
};

export const getNumOfNewNotification = async (userId: string): Promise<number> => {
  const {data} = await MyriadAPI.request<TotalNewNotification>({
    url: `/notifications/count`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{to: userId}, {read: false}],
        },
      },
    },
  });

  return data.count;
};
