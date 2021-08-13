import getConfig from 'next/config';

import {BaseList} from './interfaces/base-list.interface';

import Axios from 'axios';
import {CommentProps} from 'src/interfaces/comment';
import {Post, PostProps, ImportPostProps, Like, Dislike} from 'src/interfaces/post';
import {TimelineSortMethod, TimelineFilter} from 'src/interfaces/timeline';

const {publicRuntimeConfig} = getConfig();

const MyriadAPI = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

const LIMIT = 10;

type PostList = BaseList<Post>;

export const getPost = async (
  page: number,
  sort?: TimelineSortMethod,
  filters?: TimelineFilter,
): Promise<Post[]> => {
  let orderField = 'originCreatedAt';

  switch (sort) {
    case 'comment':
      orderField = 'metric.comment';
      break;
    case 'like':
      orderField = 'metric.liked';
      break;
    case 'trending':
    default:
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (filters && filters.tags && filters.tags.length) {
    where.tags = {
      inq: filters.tags,
    };
  }

  if (filters && filters.layout === 'photo') {
    where.hasMedia = true;
  }

  if (filters && filters.platform && filters.platform.length) {
    where.platform = {
      inq: filters.platform,
    };
  }

  if (filters && filters.owner) {
    where.walletAddress = {
      inq: [filters.owner],
    };
  }

  if (filters && filters.importer) {
    where.importBy = {
      inq: [filters.importer],
    };
  }

  const {data} = await MyriadAPI.request<Post[]>({
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
                  relation: 'user',
                },
              ],
            },
          },
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
        ],
      },
    },
  });

  return data;
};

export const getFriendPost = async (
  userId: string,
  page: number,
  sort?: TimelineSortMethod,
): Promise<PostList> => {
  const path = `/posts`;
  let orderField = 'platformCreatedAt DESC';

  if (sort) {
    switch (sort) {
      case 'comment':
        orderField = 'comment';
        break;
      case 'like':
        orderField = 'liked';
        break;
      case 'trending':
      default:
        break;
    }
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: path,
    method: 'GET',
    params: {
      filter: {
        page,
        limit: LIMIT,
        orderField,
        include: ['user', 'people'],
      },
    },
  });

  return data;
};

export const createPost = async (values: PostProps): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: '/posts',
    method: 'POST',
    data: values,
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: values,
  });

  return data;
};

export const getPostDetail = async (id: string): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'GET',
    params: {
      filter: {
        include: [
          {
            relation: 'comments',
            scope: {
              include: [
                {
                  relation: 'user',
                },
              ],
            },
          },
          {
            relation: 'publicMetric',
          },
        ],
      },
    },
  });

  return data;
};

export const loadComments = async (postId: string, excludeUser?: string): Promise<Comment[]> => {
  let where = {};

  if (excludeUser) {
    where = {
      ...where,
      userId: {
        neq: excludeUser,
      },
    };
  }
  const {data} = await MyriadAPI.request<Comment[]>({
    url: `/posts/${postId}/comments`,
    params: {
      filter: {
        where,
        include: ['user'],
      },
    },
    method: 'GET',
  });

  return data;
};

export const reply = async (postId: string, comment: CommentProps): Promise<Comment> => {
  const {data} = await MyriadAPI.request<Comment>({
    url: `/posts/${postId}/comments`,
    method: 'POST',
    data: comment,
  });

  return data;
};

export const like = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const getLikes = async (postId: string): Promise<Like[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'GET',
  });

  return data;
};

export const getDislikes = async (postId: string): Promise<Dislike[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'GET',
  });

  return data;
};

export const dislike = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const updateTips = async (
  tokenId: string,
  tipsReceived: number,
  postId: string,
): Promise<void> => {
  try {
    await MyriadAPI.request({
      url: `/posts/${postId}/update-tips`,
      method: 'POST',
      data: {
        tokenId,
        tipsReceived,
      },
    });
  } catch (error) {
    console.log('error from updateTips: ', error);
  }
};

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}`,
    method: 'DELETE',
  });
};
