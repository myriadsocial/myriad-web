import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Like} from 'src/interfaces/interaction';
import {Post, PostProps, ImportPostProps, Dislike} from 'src/interfaces/post';
import {SocialsEnum} from 'src/interfaces/social';
import {TimelineSortMethod, TimelineFilter} from 'src/interfaces/timeline';

type PostList = BaseList<Post>;

export const getPost = async (
  page: number,
  sort?: TimelineSortMethod,
  filters?: TimelineFilter,
): Promise<PostList> => {
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
  const where: Partial<Record<keyof PostProps, any>> = {};

  if (filters && filters.tags && filters.tags.length) {
    where.tags = {
      inq: filters.tags,
    };
  }

  if (filters && filters.layout === 'photo') {
    // code
  }

  if (filters && filters.platform && filters.platform.length) {
    where.platform = {
      inq: filters.platform,
    };
  }

  if (filters && filters.owner) {
    where.createdBy = {
      eq: filters.owner,
    };
  }

  if (filters && filters.importer) {
    where.createdBy = {
      inq: filters.importer,
    };

    where.platform = {
      inq: [SocialsEnum.TWITTER, SocialsEnum.FACEBOOK, SocialsEnum.REDDIT],
    };
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: '/posts',
    method: 'GET',
    params: {
      filter: {
        page,
        limit: PAGINATION_LIMIT,
        order: `${orderField} DESC`,
        where,
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
          {
            relation: 'likes',
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
  let orderField = 'originCreatedAt';

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
        limit: PAGINATION_LIMIT,
        order: `${orderField} DESC`,
        include: [
          'user',
          'people',
          {
            relation: 'likes',
            scope: {
              where: {
                userId: {eq: userId},
              },
            },
          },
        ],
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
