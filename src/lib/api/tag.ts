import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Tag} from 'src/interfaces/experience';

type TagList = BaseList<Tag>;
type TrendingList = BaseList<Tag>;

export const loadTag = async (page = 1): Promise<TagList> => {
  const {data} = await MyriadAPI().request<TagList>({
    url: '/tags',
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {},
    },
  });

  return data;
};

export const searchTag = async (query: string, page = 1): Promise<TagList> => {
  const {data} = await MyriadAPI().request<TagList>({
    url: '/tags',
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          id: {
            like: `.*${query}`,
            options: 'i',
          },
        },
      },
    },
  });

  return data;
};

export const trendingTopic = async (limit?: number): Promise<TrendingList> => {
  const {data} = await MyriadAPI().request<TrendingList>({
    url: '/tags',
    method: 'GET',
    params: {
      pageLimit: limit || PAGINATION_LIMIT,
      filter: {
        order: [`count DESC`, `updatedAt DESC`],
      },
    },
  });

  return data;
};
