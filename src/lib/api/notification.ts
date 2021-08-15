import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {Notification, TotalNewNotification} from 'src/interfaces/notification';

type NotificationList = BaseList<Notification>;

export const getNotification = async (userId: string): Promise<NotificationList> => {
  const {data} = await MyriadAPI.request<NotificationList>({
    url: `/notifications`,
    method: 'GET',
    params: {
      filter: {
        order: `createdAt DESC`,
        where: {
          and: [{to: userId}],
        },
        include: ['fromUserId', 'toUserId'],
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
