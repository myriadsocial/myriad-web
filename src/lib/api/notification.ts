import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Notification, TotalNewNotification} from 'src/interfaces/notification';

type NotificationList = BaseList<Notification>;

export const getNotification = async (userId: string, page = 1): Promise<NotificationList> => {
  const {data} = await MyriadAPI.request<NotificationList>({
    url: `/notifications`,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        order: `createdAt DESC`,
        where: {to: userId},
        include: ['fromUserId', 'toUserId'],
      },
    },
  });

  return data;
};

export const countNewNotification = async (userId: string): Promise<number> => {
  const {data} = await MyriadAPI.request<TotalNewNotification>({
    url: `/notifications/count`,
    method: 'GET',
    params: {
      where: {
        and: [{to: userId}, {read: false}],
      },
    },
  });

  return data.count;
};

export const markAsRead = async (id: string): Promise<void> => {
  await MyriadAPI.request<TotalNewNotification>({
    url: `/notifications/${id}/read`,
    method: 'PATCH',
  });
};

export const markItemsAsRead = async (ids: string[]): Promise<void> => {
  await MyriadAPI.request<TotalNewNotification>({
    url: `/notifications/read`,
    method: 'PATCH',
    data: ids,
  });
};
