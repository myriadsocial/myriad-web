import Axios from 'axios';
import {ExtendedNotification, TotalNewNotification} from 'src/interfaces/notification';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getMyNotification = async (userId: string): Promise<ExtendedNotification[]> => {
  const {data} = await MyriadAPI.request<ExtendedNotification[]>({
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
