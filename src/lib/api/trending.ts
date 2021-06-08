import Axios from 'axios';
import { Tag } from 'src/interfaces/experience';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const trendingTopic = async (limit?: number) => {
  const { data } = await MyriadAPI.request<Tag[]>({
    url: '/trending',
    method: 'GET',
    params: {
      filter: {
        limit: limit || 5
      }
    }
  });

  return data;
};
