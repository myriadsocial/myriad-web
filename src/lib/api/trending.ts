import Axios from 'axios';
import {Tag} from 'src/interfaces/experience';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const trendingTopic = async (limit?: number): Promise<Tag[]> => {
  const {data} = await MyriadAPI.request<Tag[]>({
    url: '/trending',
    method: 'GET',
    params: {
      filter: {
        limit: limit || 5,
      },
    },
  });

  return data;
};
