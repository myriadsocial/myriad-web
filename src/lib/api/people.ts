import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {People} from 'src/interfaces/people';
import {SocialsEnum} from 'src/interfaces/social';

type PeopleList = BaseList<People>;

export const getPeople = async (page = 1): Promise<PeopleList> => {
  const {data} = await MyriadAPI.request<PeopleList>({
    url: `/people`,
    method: 'GET',
    params: {
      pageLimit: 10,
    },
  });

  return data;
};

export const getPeopleByPlatform = async (
  platform: SocialsEnum,
  accountId: string,
): Promise<People | null> => {
  const {data: people} = await MyriadAPI.request<People[]>({
    url: `/people`,
    method: 'GET',
    params: {
      pageLimit: 1,
      filter: {
        where: {
          platform: {
            eq: platform,
          },
          platform_account_id: {
            eq: accountId,
          },
        },
      },
    },
  });

  return people.length ? people[0] : null;
};

export const createPeople = async (values: Partial<People>): Promise<People> => {
  const {data} = await MyriadAPI.request<People>({
    url: '/people',
    method: 'POST',
    data: values,
  });

  return data;
};

export const searchPeople = async (query: string): Promise<PeopleList> => {
  const {data} = await MyriadAPI.request<PeopleList>({
    url: '/people',
    method: 'GET',
    params: {
      pageLimit: 10,
      filter: {
        where: {
          or: [
            {
              username: {
                like: `.*${query}`,
                options: 'i',
              },
            },
            {
              name: {
                like: `.*${query}`,
                options: 'i',
              },
            },
          ],
        },
      },
    },
  });

  return data;
};
