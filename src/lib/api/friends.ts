import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {PaginationParams, FilterParams} from './interfaces/pagination-params.interface';

import {Friend, FriendStatus} from 'src/interfaces/friend';

type FriendsFilterParams = FilterParams & {
  userId: string;
};
type FriendList = BaseList<Friend>;
type FriendRequestList = BaseList<Friend>;

export const getFriendRequests = async (userId: string, page = 1): Promise<FriendRequestList> => {
  const {data} = await MyriadAPI().request<FriendRequestList>({
    url: `/friends`,
    method: 'GET',
    params: {
      mutual: 'true',
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          and: [{requesteeId: userId}, {status: FriendStatus.PENDING}],
        },
        include: ['requestee', 'requestor'],
      },
    },
  });

  return data;
};

export const getFriends = async (
  userId: string,
  pagination: PaginationParams,
): Promise<FriendList> => {
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;

  const {data} = await MyriadAPI().request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      mutual: 'true',
      pageNumber: page,
      pageLimit: limit,
      filter: {
        where: {
          requestorId: userId,
          status: FriendStatus.APPROVED,
          deletedAt: {
            $exists: false,
          },
        },
        order: `${orderField} ${sort}`,
        include: [
          {
            relation: 'requestee',
            scope: {
              include: [
                {
                  relation: 'wallets',
                },
              ],
            },
          },
          {
            relation: 'requestor',
            scope: {
              include: [
                {
                  relation: 'wallets',
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

export const getBlockList = async (userId: string, page = 1): Promise<FriendList> => {
  const params: Record<string, any> = {
    filter: {
      where: {
        or: [{requesteeId: userId}, {requestorId: userId}],
        status: FriendStatus.BLOCKED,
      },
      include: ['requestee', 'requestor'],
    },
  };

  // page = 0 means fetch all
  if (page > 0) {
    params.pageNumber = page;
    params.pageLimit = PAGINATION_LIMIT;
  }

  const {data} = await MyriadAPI().request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params,
  });

  return data;
};

export const searchFriend = async (
  filter: FriendsFilterParams,
  pagination: PaginationParams,
): Promise<FriendList> => {
  const {query, userId} = filter;
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;

  const {data} = await MyriadAPI().request<FriendList>({
    url: `/users`,
    method: 'GET',
    params: {
      userId,
      friendsName: query,
      mutual: 'true',
      pageLimit: limit,
      pageNumber: page,
      filter: {
        order: `${orderField} ${sort}`,
      },
      include: [
        {
          relation: 'requestee',
          scope: {
            include: [
              {
                relation: 'wallets',
              },
            ],
          },
        },
        {
          relation: 'requestor',
          scope: {
            include: [
              {
                relation: 'wallets',
              },
            ],
          },
        },
      ],
    },
  });

  return data;
};

export const sendRequest = async (userId: string, requesteeId: string): Promise<Friend> => {
  const result = await MyriadAPI().request<Friend>({
    url: `/friends`,
    method: 'POST',
    data: {
      status: 'pending',
      requesteeId,
      requestorId: userId,
    },
  });

  return result.data;
};

export const toggleRequest = async (requestId: string, status: FriendStatus): Promise<void> => {
  await MyriadAPI().request({
    url: `/friends/${requestId}`,
    method: 'PATCH',
    data: {
      status,
    },
  });
};

export const deleteRequest = async (requestId: string): Promise<void> => {
  await MyriadAPI().request({
    url: `/friends/${requestId}`,
    method: 'DELETE',
  });
};

export const blockUser = async (requesteeId: string, userId: string): Promise<Friend> => {
  const result = await MyriadAPI().request({
    url: '/friends',
    method: 'POST',
    data: {
      status: 'blocked',
      requesteeId: requesteeId,
      requestorId: userId,
    },
  });

  return result.data;
};
