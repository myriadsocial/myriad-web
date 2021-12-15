import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {ExperienceType} from 'src/components/Timeline/default';
import {Experience, UserExperience} from 'src/interfaces/experience';

type ExperienceList = BaseList<Experience>;
type UserExperienceList = BaseList<UserExperience>;

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

export const searchExperience = async (query: string): Promise<UserExperienceList> => {
  const {data} = await MyriadAPI.request<UserExperienceList>({
    url: `/user-experiences`,
    method: 'GET',
    params: {
      filter: {
        include: [
          'user',
          {
            relation: 'experience',
            scope: {
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
              include: [
                {
                  relation: 'user',
                },
              ],
            },
          },
        ],
      },
    },
  });

  return data;
};

export const searchExperiencesByQuery = async (query: string): Promise<ExperienceList> => {
  //const pattern = new RegExp('.*' + query + '.*', 'i');
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [
            {
              name: {
                like: `.*${query}.*`,
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

export const getUserExperience = async (
  userId: string,
  type?: ExperienceType,
): Promise<UserExperienceList> => {
  const where: Record<string, any> = {
    userId,
  };

  if (type === 'personal') {
    where.subscribed = false;
  }

  if (type === 'other') {
    where.subscribed = true;
  }

  const {data} = await MyriadAPI.request<UserExperienceList>({
    url: `/user-experiences`,
    method: 'GET',
    params: {
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where,
        order: `createdAt DESC`,
        include: [
          'user',
          {
            relation: 'experience',
            scope: {
              include: [
                {
                  relation: 'user',
                },
              ],
            },
          },
        ],
      },
    },
  });
  return data;
};

export const cloneExperience = async (
  userId: string,
  experienceId: string,
  experience: Experience,
): Promise<UserExperience> => {
  const {data} = await MyriadAPI.request<UserExperience>({
    url: `/users/${userId}/clone/${experienceId}`,
    method: 'POST',
    data: experience,
  });
  return data;
};

export const subscribeExperience = async (userId: string, experienceId: string): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/users/${userId}/subscribe/${experienceId}`,
    method: 'POST',
  });
};

export const updateExperience = async (
  userId: string,
  experienceId: string,
  data: Partial<Experience>,
): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/users/${userId}/experiences/${experienceId}`,
    method: 'PATCH',
    data,
  });
};

export const createExperience = async (
  userId: string,
  experience: Experience,
): Promise<Experience> => {
  const {data} = await MyriadAPI.request<Experience>({
    url: `/users/${userId}/new-experiences`,
    method: 'POST',
    data: experience,
  });

  return data;
};

export const getExperience = async (experienceId: string): Promise<Experience> => {
  const {data} = await MyriadAPI.request<Experience>({
    url: `/experiences/${experienceId}`,
    method: 'GET',
    params: {
      filter: {
        include: ['user', 'users'],
      },
    },
  });

  return data;
};

export const deleteExperience = async (experienceId: string): Promise<Experience> => {
  const {data} = await MyriadAPI.request<Experience>({
    url: `/user-experiences/${experienceId}`,
    method: 'DELETE',
  });
  return data;
};
