import Axios from 'axios';
import {ExtendedNotification} from 'src/interfaces/notification';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getMyNotification = async (userId: string): Promise<ExtendedNotification[]> => {
  const {data} = await MyriadAPI.request<ExtendedNotification[]>({
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
