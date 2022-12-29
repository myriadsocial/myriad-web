import {TimelineFilters} from '../../reducers/timeline/reducer';
import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {PostImportError} from './errors/post-import.error';
import {BaseList} from './interfaces/base-list.interface';
import {BaseErrorResponse} from './interfaces/error-response.interface';
import {PaginationParams, FilterParams} from './interfaces/pagination-params.interface';

import axios, {AxiosError} from 'axios';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {Post, PostProps, ImportPostProps, PostStatus, PostCustomProps} from 'src/interfaces/post';
import {TimelineOrderType, TimelineType} from 'src/interfaces/timeline';
import {WalletDetail} from 'src/interfaces/wallet';

type PostList = BaseList<Omit<Post, keyof PostCustomProps>>;
type PostsFilterParams = FilterParams & {
  userId?: string;
};
type PostsPaginationParams = PaginationParams & {
  orderField?: TimelineOrderType;
};

export const getPost = async (
  page: number,
  userId: string,
  type: TimelineType = TimelineType.TRENDING,
  filters?: TimelineFilters,
): Promise<PostList> => {
  const {sort = 'DESC', order = TimelineOrderType.LATEST, fields, query} = filters;
  const filterParams: Record<string, any> = {
    include: [
      {
        relation: 'user',
        scope: {
          include: [
            {
              relation: 'wallets',
            },
          ],
        },
      },
      {
        relation: 'people',
        scope: {
          include: [{relation: 'userSocialMedia'}],
        },
      },
    ],
  };

  if (userId) {
    filterParams.include.push({
      relation: 'votes',
      scope: {
        where: {
          userId: {eq: userId},
        },
      },
    });
  }

  let params: Record<string, any> = {
    sortBy: order,
    order: sort,
    pageNumber: page,
    pageLimit: PAGINATION_LIMIT,
  };

  switch (type) {
    case TimelineType.FRIEND:
    case TimelineType.TRENDING:
      params.filter = filterParams;
      params.timelineType = type;
      break;
    case TimelineType.EXPERIENCE:
      params.filter = filterParams;
      params.timelineType = type;
      params.experienceId = fields?.experienceId;
      break;
    default:
      if (fields && fields.platform && fields.platform.length) {
        if (fields.platform[0] === 'myriad') {
          params.platform = 'myriad';
        } else {
          params.platform = 'imported';
        }
      }

      if (fields && fields?.owner) {
        params.owner = fields.owner;
      }

      if (!fields?.owner && (!fields?.tags || fields.tags?.length === 0)) {
        params.timelineType = TimelineType.ALL;
      }

      if (fields?.tags?.length) {
        params.topic = fields.tags;
      }

      params.filter = filterParams;
      break;
  }

  if (query) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {filter, timelineType, ...restParams} = Object.assign({}, params);

    params = restParams;
    params.q = query;
  }

  const {data} = await MyriadAPI().request<PostList>({
    url: '/user/posts',
    method: 'GET',
    params,
  });

  data.data.map(post => {
    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

    if (post.deletedAt) {
      post.text = '[post removed]';
    }

    return post;
  });

  return data;
};

export const findPosts = async (
  filter: PostsFilterParams,
  pagination: PostsPaginationParams,
): Promise<PostList> => {
  const {
    page = 1,
    limit = PAGINATION_LIMIT,
    orderField = TimelineOrderType.LATEST,
    sort = 'DESC',
  } = pagination;
  const path = `/user/posts?q=${encodeURIComponent(filter.query)}`;

  const include: Array<any> = [
    {
      relation: 'user',
      scope: {
        include: [
          {
            relation: 'wallets',
          },
        ],
      },
    },
    {
      relation: 'people',
      scope: {
        include: [{relation: 'userSocialMedia'}],
      },
    },
  ];

  if (filter.userId) {
    include.push({
      relation: 'votes',
      scope: {
        where: {
          userId: {eq: filter.userId},
        },
      },
    });
  }

  const {data} = await MyriadAPI().request<PostList>({
    url: path,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: limit,
      importers: true,
      sortBy: orderField,
      order: sort,
      filter: {
        include,
      },
    },
  });

  data.data.map(post => {
    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

    return post;
  });

  return data;
};

export const createPost = async (values: PostProps): Promise<Post> => {
  console.log('values >>>', values);
  const {data} = await MyriadAPI().request<Post>({
    url: '/user/posts',
    method: 'POST',
    data: {
      ...values,
      status: PostStatus.PUBLISHED,
    },
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  try {
    const {data} = await MyriadAPI().request<Post>({
      url: `/user/posts/import`,
      method: 'POST',
      data: values,
    });

    if (data.platform === 'reddit') {
      data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const {response} = error as AxiosError<BaseErrorResponse>;

      throw new PostImportError(response.data.error);
    } else {
      throw error;
    }
  }
};

export const getPostDetail = async (
  id: string,
  currentUserId?: string,
): Promise<Omit<Post, keyof PostCustomProps>> => {
  const includes: Array<any> = [
    {
      relation: 'user',
      scope: {
        include: [
          {
            relation: 'wallets',
          },
        ],
      },
    },
    {
      relation: 'people',
      scope: {
        include: [{relation: 'userSocialMedia'}],
      },
    },
  ];

  if (currentUserId) {
    includes.push({
      relation: 'votes',
      scope: {
        where: {
          userId: {eq: currentUserId},
        },
      },
    });
  }

  const {data} = await MyriadAPI().request<Post>({
    url: `/user/posts/${id}`,
    method: 'GET',
    params: {
      importers: true,
      filter: {
        include: includes,
      },
    },
  });

  if (data.platform === 'reddit') {
    data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
  }

  return data;
};

export const editPost = async (id: string, payload: Partial<PostProps>): Promise<void> => {
  await MyriadAPI().request<Post>({
    url: `/user/posts/${id}`,
    method: 'PATCH',
    data: payload,
  });
};

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI().request({
    url: `/user/posts/${postId}`,
    method: 'DELETE',
  });
};

export const getWalletAddress = async (postId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI().request<WalletDetail>({
    url: `/walletaddress/post/${postId}`,
    method: 'GET',
  });

  return data;
};

export const createExclusiveContent = async (values: ExclusiveContentPost): Promise<Post> => {
  console.log('values >>>', values);
  const {data} = await MyriadAPI().request<Post>({
    url: '/user/unlockable-contents',
    method: 'POST',
    data: {
      ...values,
    },
  });

  return data;
};

export const getPriceExclusiveContent = async (url: string): Promise<Post> => {
  const {data} = await MyriadAPI().request<Post>({
    url: `${url}`,
    method: 'GET',
    params: {
      filter: {
        include: [
          {relation: 'user'}, // kalo mau menampilkan user nya
          {
            relation: 'prices', // kalo mau meampilkan prices nya
            scope: {
              include: [
                {
                  relation: 'currency', // kalo mau menampilkan prices dan currency nya
                  scope: {
                    include: [
                      {relation: 'network'}, // kalo mau menampilkan currency dan network nya
                    ],
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

export const getWalletAddressExclusive = async (contentId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI().request<WalletDetail>({
    url: `/walletaddress/unlockable-content/${contentId}`,
    method: 'GET',
  });

  return data;
};
