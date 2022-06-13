import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {People} from 'src/interfaces/people';

type PeopleList = BaseList<People>;

export const getPeople = async (page = 1): Promise<PeopleList> => {
  const {data} = await MyriadAPI().request<PeopleList>({
    url: `/people`,
    method: 'GET',
    params: {
      pageLimit: 10,
    },
  });

  return data;
};

export const searchPeople = async (query: string): Promise<People[]> => {
  const {data} = await MyriadAPI().request<People[]>({
    url: `/people/search?q=${query}`,
    method: 'GET',
  });

  return data;
};
