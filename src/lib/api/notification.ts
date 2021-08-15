import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {Notification} from 'src/interfaces/notification';

type NotificationList = BaseList<Notification>;

export const getNotification = async (userId: string): Promise<NotificationList> => {
  const {data} = await MyriadAPI.request<NotificationList>({
    url: `/notifications`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{to: userId}],
        },
        include: ['fromUserId', 'toUserId'],
      },
    },
  });

  return data;
};
