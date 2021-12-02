import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {LoopbackWhere} from './interfaces/loopback-query.interface';

import {Dislike, Like} from 'src/interfaces/interaction';
import {Post, PostProps, ImportPostProps, PostVisibility} from 'src/interfaces/post';
import {TimelineSortMethod, TimelineFilter, TimelineType} from 'src/interfaces/timeline';

type PostList = BaseList<Post>;
type WalletAddress = {
  walletAddress: string;
};

export const getPost = async (
  page: number,
  userId: string,
  type: TimelineType = TimelineType.TRENDING,
  sort?: TimelineSortMethod,
  filters?: TimelineFilter,
  asFriend = false,
): Promise<PostList> => {
  const where: LoopbackWhere<PostProps> = {};

  let sortField = 'latest';

  switch (sort) {
    case 'comment':
      sortField = 'comment';
      break;
    case 'like':
      sortField = 'upvote';
      break;
    case 'trending':
      sortField = 'popular';
      break;
    case 'created':
    default:
      break;
  }

  if (filters && filters.tags && filters.tags.length) {
    const condition = {
      tags: {
        inq: filters.tags,
      },
    };

    if (where.or) {
      where.or.push(condition);
    } else {
      where.or = [condition];
    }

    where.visibility = {
      inq: [PostVisibility.PUBLIC],
    };
  }

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
    where.or = [
      {
        createdBy: {
          eq: filters.owner,
        },
      },
      {
        importers: {
          inq: [filters.owner],
        },
      },
    ];

    if (userId === filters.owner) {
      delete where.deletedAt;
    } else {
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

  if (filters && filters.importer) {
    // @ts-expect-error
    where.importers = {
      inq: [filters.importer],
    };

    if (userId === filters.importer) {
      delete where.deletedAt;
    } else {
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
      },
      {
        relation: 'people',
      },
      {
        relation: 'votes',
        scope: {
          where: {
            userId: {eq: userId},
          },
        },
      },
    ],
  };

  const params: Record<string, any> = {
    sortBy: sortField,
    order: `DESC`,
    importers: true,
    pageNumber: page,
    pageLimit: PAGINATION_LIMIT,
  };

  switch (type) {
    case TimelineType.FRIEND:
    case TimelineType.TRENDING:
      params.filter = filterParams;
      params.userId = userId;
      params.timelineType = type;
      break;
    case TimelineType.EXPERIENCE:
      params.filter = filterParams;
      params.userId = userId;

      if (
        filters &&
        ((filters.tags && filters.tags.length > 0) || (filters.people && filters.people.length > 0))
      ) {
        filterParams.where = where;
      } else {
        params.timelineType = type;
      }
      break;
    default:
      filterParams.where = where;

      if (!filters?.importer && !filters?.owner && (!filters?.tags || filters.tags?.length === 0)) {
        params.timelineType = TimelineType.ALL;
      }

      params.filter = filterParams;
      params.userId = userId;
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

export const findPosts = async (page: number, userId: string, query: string): Promise<PostList> => {
  const {data} = await MyriadAPI.request<PostList>({
    url: `/posts?q=${encodeURIComponent(query)}`,
    method: 'GET',
    params: {
      userId,
      importers: true,
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
          {
            relation: 'votes',
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
    data: values,
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  const attributes: ImportPostProps = {
    ...values,
    tags: values.tags ?? [],
  };

  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: attributes,
  });

  return data;
};

export const getPostDetail = async (id: string, userId?: string): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'GET',
    params: {
      importers: true,
      filter: {
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
          {
            relation: 'votes',
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

  if (data.platform === 'reddit') {
    data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
  }

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

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}`,
    method: 'DELETE',
  });
};

export const getWalletAddress = async (postId: string): Promise<WalletAddress> => {
  const {data} = await MyriadAPI.request<WalletAddress>({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};
