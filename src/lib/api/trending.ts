import MyriadAPI from './base';

import {Tag} from 'src/interfaces/experience';

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
