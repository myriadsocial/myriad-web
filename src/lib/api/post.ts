import Axios from 'axios';
import { Post, Comment, CreateCommentProps, ImportPost } from 'src/interfaces/post';
import { PostSortMethod, PostFilter } from 'src/interfaces/timeline';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const LIMIT = 10;

export const getPost = async (page: number, sort: PostSortMethod, filters: PostFilter): Promise<Post[]> => {
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

  let where: Record<string, any> = {};

  if (filters.tags.length) {
    where.tags = {
      inq: filters.tags
    };
  }

  if (filters.layout === 'photo') {
    where.hasMedia = true;
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

export const getFriendPost = async (userId: string, page: number, sort?: PostSortMethod): Promise<Post[]> => {
  const path = `/users/${userId}/timeline`;
  let orderField = 'platformCreatedAt';

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

  const { data } = await MyriadAPI.request<Post[]>({
    url: path,
    method: 'GET',
    params: {
      offset: Math.max(page - 1, 0) * LIMIT,
      limit: LIMIT,
      orderField
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

export const getPostDetail = async (id: string): Promise<Post> => {
  const { data } = await MyriadAPI.request<Post>({
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

export const loadComments = async (postId: string, excludeUser?: string): Promise<Comment[]> => {
  let where = {};

  if (excludeUser) {
    where = {
      ...where,
      userId: {
        neq: excludeUser
      }
    };
  }
  const { data } = await MyriadAPI.request<Comment[]>({
    url: `/posts/${postId}/comments`,
    params: {
      filter: {
        where,
        include: ['user']
      }
    },
    method: 'GET'
  });

  return data;
};

export const reply = async (postId: string, comment: Comment): Promise<Comment> => {
  const { data } = await MyriadAPI.request<Comment>({
    url: `/posts/${postId}/comments`,
    method: 'POST',
    data: comment
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
      postId
    }
  });
};

export const dislike = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId
    }
  });
};

export const updateTips = async (tokenId: string, tipsReceived: number, postId: string): Promise<void> => {
  try {
    await MyriadAPI.request({
      url: `/posts/${postId}/update-tips`,
      method: 'POST',
      data: {
        tokenId,
        tipsReceived
      }
    });
  } catch (error) {
    console.log('error from updateTips: ', error);
  }
};
