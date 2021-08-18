import getConfig from 'next/config';

import Axios from 'axios';
import {Tag} from 'src/interfaces/experience';

const {publicRuntimeConfig} = getConfig();

const MyriadAPI = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
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
