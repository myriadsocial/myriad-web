import { User } from 'next-auth';

import Axios from 'axios';
import { WithAdditionalParams } from 'next-auth/_utils';
import { Post, Comment, PostSortMethod, PostFilter, ImportPost } from 'src/interfaces/post';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

const LIMIT = 10;

export const getPost = async (
  user: WithAdditionalParams<User>,
  page: number,
  sort: PostSortMethod,
  filters: PostFilter
): Promise<Post[]> => {
  let orderField = 'platformCreatedAt';

  switch (sort) {
    case 'comment':
      orderField = 'publicMetric.comment';
      break;
    case 'like':
      orderField = 'publicMetric.liked';
      break;
    case 'trending':
    default:
      break;
  }

  let where = {
    and: [
      {
        platform: {
          inq: filters.platform
        }
      },
      {
        or: [
          {
            tags: {
              inq: filters.tags
            }
          },
          {
            'platformUser.username': {
              inq: [...filters.people, user.name]
            }
          }
        ]
      }
    ]
  };

  if (filters.layout === 'photo') {
    where = {
      ...where,
      //@ts-ignore
      hasMedia: true
    };
  }

  const { data } = await MyriadAPI.request<Post[]>({
    url: '/posts',
    method: 'GET',
    params: {
      filter: {
        offset: Math.max(page - 1, 0) * LIMIT,
        limit: LIMIT,
        order: `${orderField} DESC`,
        where,
        include: [
          {
            relation: 'comments',
            scope: {
              include: [
                {
                  relation: 'user'
                }
              ]
            }
          },
          {
            relation: 'publicMetric'
          }
        ]
      }
    }
  });

  return data;
};

export const createPost = async (values: Partial<Post>): Promise<Post> => {
  const { data } = await MyriadAPI.request<Post>({
    url: '/posts',
    method: 'POST',
    data: values
  });

  return data;
};

export const importPost = async (values: ImportPost): Promise<Post> => {
  const { data } = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: values
  });

  return data;
};

export const loadComments = async (postId: string) => {
  const { data } = await MyriadAPI.request({
    url: `/posts/${postId}/comments`,
    params: {
      include: ['user']
    },
    method: 'GET'
  });

  return data;
};

export const reply = async (postId: string, comment: Comment) => {
  const { data } = await MyriadAPI.request({
    url: `/posts/${postId}/comments`,
    method: 'POST',
    data: comment
  });

  return data;
};
