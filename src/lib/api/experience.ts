import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {PaginationParams} from './interfaces/pagination-params.interface';

import {
  Experience,
  ExperienceProps,
  UserExperience,
  ExperienceType,
} from 'src/interfaces/experience';
import {Post} from 'src/interfaces/post';

type ExperienceList = BaseList<Experience>;
type UserExperienceList = BaseList<UserExperience>;
type PostsExperienceList = BaseList<Post>;

export const getExperiences = async (
  params: PaginationParams,
  isTrending?: boolean,
  userId?: string,
  postId?: string,
): Promise<ExperienceList> => {
  const {orderField = 'createdAt', sort = 'DESC'} = params;

  let order: string | string[] = `${orderField} ${sort}`;
  if (isTrending) order = ['trendCount DESC', `${orderField} ${sort}`];

  let paramGetExperience;

  if (postId && userId) {
    paramGetExperience = {
      pageLimit: params.limit ?? PAGINATION_LIMIT,
      filter: {
        where: {
          createdBy: userId,
        },
        include: [
          {
            relation: 'posts',
            scope: {
              where: {
                id: postId,
              },
            },
          },
        ],
      },
    };
  } else {
    paramGetExperience = {
      pageLimit: params.limit ?? PAGINATION_LIMIT,
      filter: {
        order,
        include: ['user'],
      },
    };
  }

  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences`,
    method: 'GET',
    params: paramGetExperience,
  });

  return data;
};

export const searchUserExperience = async (query: string): Promise<UserExperienceList> => {
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

export const searchExperiences = async (query: string, page = 1): Promise<ExperienceList> => {
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences`,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      q: query,
      filter: {
        include: ['user'],
      },
    },
  });

  return data;
};

export const getUserExperiences = async (
  userId: string,
  type?: ExperienceType,
): Promise<UserExperienceList> => {
  const where: Record<string, any> = {
    userId,
    deletedAt: {
      $exists: false,
    },
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
                  scope: {
                    include: [{relation: 'accountSetting'}],
                  },
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

export const subscribeExperience = async (userId: string, experienceId: string): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/users/${userId}/subscribe/${experienceId}`,
    method: 'POST',
  });
};

export const unsubscribeExperience = async (userExperienceId: string): Promise<void> => {
  await MyriadAPI.request<Experience>({
    url: `/user-experiences/${userExperienceId}`,
    method: 'DELETE',
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
  experience: ExperienceProps,
  experienceId?: string, // parse experience id to mark as cloned
): Promise<Experience> => {
  const params: Record<string, string> = {};

  if (experienceId) {
    params.experienceId = experienceId;
  }

  const {data} = await MyriadAPI.request<Experience>({
    url: `/users/${userId}/experiences`,
    method: 'POST',
    data: experience,
    params,
  });

  return data;
};

export const getExperienceDetail = async (experienceId: string): Promise<Experience> => {
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

export const getExperiencePost = async (
  experienceId: string,
  page = 1,
): Promise<PostsExperienceList> => {
  const {data} = await MyriadAPI.request<PostsExperienceList>({
    url: `/experiences/${experienceId}/posts`,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        include: [{relation: 'user'}, {relation: 'people'}],
      },
    },
  });
  return data;
};

export const getUserExperienceDetail = async (
  userExperienceId: string,
): Promise<UserExperience> => {
  const {data} = await MyriadAPI.request<UserExperience>({
    url: `/user-experiences/${userExperienceId}`,
    method: 'GET',
    params: {
      filter: {
        include: [
          'user',
          {
            relation: 'experience',
            scope: {
              include: [
                {
                  relation: 'user',
                  scope: {
                    include: [{relation: 'accountSetting'}],
                  },
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

export const deleteExperience = async (experienceId: string): Promise<Experience> => {
  const {data} = await MyriadAPI.request<Experience>({
    url: `/user-experiences/${experienceId}`,
    method: 'DELETE',
  });
  return data;
};

export const addPostsExperience = async (
  postId: string,
  listExperiences: string[],
): Promise<ExperienceList> => {
  const {data} = await MyriadAPI.request<ExperienceList>({
    url: `/experiences/post/${postId}`,
    method: 'POST',
    data: listExperiences,
  });
  return data;
};
