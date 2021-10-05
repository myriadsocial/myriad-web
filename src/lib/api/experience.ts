import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Experience, ExperienceProps} from 'src/interfaces/experience';

type ExperienceList = BaseList<Experience>;

export const getAllExperiences = async (): Promise<ExperienceList> => {
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences`,
    method: 'GET',
    params: {
      filter: {
        include: ['user'],
      },
    },
  });

  return data;
};

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
    url: `/experiences`,
    method: 'GET',
    params: {
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          and: [{createdBy: userId}],
        },
        include: ['user'],
      },
    },
  });
  return data;
};

export const createUserExperience = async (values: ExperienceProps): Promise<Experience> => {
  const {data} = await MyriadAPI.request<Experience>({
    url: '/user-experiences',
    method: 'POST',
    data: values,
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

export const createExperience = async (userId: string, experience: Experience): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/users/${userId}/new-experiences`,
    method: 'POST',
    data: experience,
  });
};
