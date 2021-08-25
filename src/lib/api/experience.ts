import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Experience} from 'src/interfaces/experience';

type ExperienceList = BaseList<Experience>;

export const searchExperience = async (query: string): Promise<ExperienceList> => {
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [
            {
              name: {
                like: `${query}.*`,
                options: 'i',
              },
            },
          ],
        },
        include: ['user'],
      },
    },
  });

  return data;
};

export const getUserExperience = async (userId: string): Promise<ExperienceList> => {
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/user-experiences`,
    method: 'GET',
    params: {
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          and: [{userId}],
        },
        include: ['user'],
      },
    },
  });

  return data;
};

export const cloneExperience = async (userId: string, experienceId: string): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/clone-user-experiences`,
    method: 'POST',
    data: {
      experienceId,
      userId,
    },
  });
};
