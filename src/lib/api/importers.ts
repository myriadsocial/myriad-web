import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Importer} from 'src/interfaces/user';

type ImporterList = BaseList<Importer>;

export const getImporters = async (
  originPostId: string,
  platform: string,
  userId: string,
  page = 1,
): Promise<ImporterList> => {
  const {data} = await MyriadAPI.request<ImporterList>({
    url: `/posts/${originPostId}/importers/${platform}`,
    method: 'GET',
    params: {
      pageNumber: 1,
      pageLimit: PAGINATION_LIMIT,
      userId: userId,
    },
  });

  return data;
};
