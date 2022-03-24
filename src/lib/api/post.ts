import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {LoopbackWhere} from './interfaces/loopback-query.interface';
import {PaginationParams, FilterParams, SortType} from './interfaces/pagination-params.interface';

import {Post, PostProps, ImportPostProps, PostVisibility, PostStatus} from 'src/interfaces/post';
import {TimelineOrderType, TimelineFilter, TimelineType, PostOrigin} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';

type PostList = BaseList<Post>;
type ImporterList = BaseList<User>;
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
  order: TimelineOrderType = TimelineOrderType.LATEST,
  filters?: TimelineFilter,
  asFriend = false,
  sort: SortType = 'DESC',
): Promise<PostList> => {
  const where: LoopbackWhere<PostProps> = {};

  if (filters && filters.people && filters.people.length) {
    const condition = {
      peopleId: {
        inq: filters.people,
      },
    };

    if (where.or) {
      where.or.push(condition);
    } else {
      where.or = [condition];
    }
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

    if (userId !== filters.owner) {
      // filter only public post if no friend status provided
      if (asFriend) {
        where.visibility = {
          inq: [PostVisibility.PUBLIC, PostVisibility.FRIEND],
        };
      } else {
        where.visibility = {
          eq: PostVisibility.PUBLIC,
        };
      }
    }
  }

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

  const params: Record<string, any> = {
    sortBy: order,
    order: sort,
    importers: true,
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
      params.experienceId = filters?.experienceId;
      break;
    default:
      filterParams.where = where;

      if (!filters?.importer && !filters?.owner && (!filters?.tags || filters.tags?.length === 0)) {
        params.timelineType = TimelineType.ALL;
      }

      if (filters?.tags?.length) {
        params.topic = filters.tags;
      }

      params.filter = filterParams;
      break;
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: '/posts',
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
  const path = `/posts?q=${encodeURIComponent(filter.query)}`;

  const include: Array<any> = [
    {
      relation: 'user',
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

  const {data} = await MyriadAPI.request<PostList>({
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
  const {data} = await MyriadAPI.request<Post>({
    url: '/posts',
    method: 'POST',
    data: {
      ...values,
      status: PostStatus.PUBLISHED,
    },
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  const attributes: ImportPostProps = {
    ...values,
  };

  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: attributes,
  });

  if (data.platform === 'reddit') {
    data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
  }

  return data;
};

export const getPostDetail = async (id: string, currentUserId?: string): Promise<Post> => {
  const includes: Array<any> = [
    {
      relation: 'user',
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

  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
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
  await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'PATCH',
    data: payload,
  });
};

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}`,
    method: 'DELETE',
  });
};

export const getWalletAddress = async (postId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI.request<WalletDetail>({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};

export const getImporters = async (
  originPostId: string,
  platform: PostOrigin,
): Promise<ImporterList> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${originPostId}/importers/${platform}`,
    method: 'GET',
  });

  return data;
};
