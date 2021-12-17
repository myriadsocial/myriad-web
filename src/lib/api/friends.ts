import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Friend, FriendStatus} from 'src/interfaces/friend';

type FriendList = BaseList<Friend>;
type FriendRequestList = BaseList<Friend>;

export const getSentRequests = async (userId: string): Promise<FriendList> => {
  const {data} = await MyriadAPI.request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{requestorId: userId}, {status: FriendStatus.PENDING}],
        },
      },
    },
  });

  return data;
};

export const getFriendRequests = async (userId: string, page = 1): Promise<FriendRequestList> => {
  const {data} = await MyriadAPI.request<FriendRequestList>({
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

export const getFriends = async (userId: string, page = 1): Promise<FriendList> => {
  const {data} = await MyriadAPI.request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      mutual: 'true',
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          or: [{requestorId: userId}],
          status: FriendStatus.APPROVED,
        },
        include: ['requestee', 'requestor'],
        order: `createdAt DESC`,
      },
    },
  });
  return data;
};

export const getBlockList = async (userId: string, page = 1): Promise<FriendList> => {
  const {data} = await MyriadAPI.request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        where: {
          or: [{requesteeId: userId}, {requestorId: userId}],
          status: FriendStatus.BLOCKED,
        },
        include: ['requestee', 'requestor'],
      },
    },
  });

  return data;
};

export const searchFriend = async (userId: string, query: string): Promise<FriendList> => {
  const {data} = await MyriadAPI.request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          status: FriendStatus.APPROVED,
          or: [{requestorId: userId}, {requesteeId: userId}],
        },
        include: [
          {
            relation: 'requestor',
            scope: {
              where: {
                or: [
                  {
                    name: {
                      like: `${query}.*`,
                      options: 'i',
                    },
                  },
                  {id: userId},
                ],
              },
            },
          },
          {
            relation: 'requestee',
            scope: {
              where: {
                or: [
                  {
                    name: {
                      like: `${query}.*`,
                      options: 'i',
                    },
                  },
                  {id: userId},
                ],
              },
            },
          },
        ],
      },
    },
  });

  return data;
};

export const checkFriendStatus = async (
  userId: string,
  friendIds: string[],
): Promise<FriendList> => {
  const {data} = await MyriadAPI.request<FriendList>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          or: [
            {
              requesteeId: {
                inq: friendIds,
              },
              requestorId: {
                eq: userId,
              },
            },
            {
              requestorId: {
                inq: friendIds,
              },
              requesteeId: userId,
            },
          ],
        },
        include: ['requestee', 'requestor'],
      },
    },
  });

  return data;
};

export const sendRequest = async (userId: string, requesteeId: string): Promise<void> => {
  await MyriadAPI.request<Friend[]>({
    url: `/friends`,
    method: 'POST',
    data: {
      status: 'pending',
      requesteeId,
      requestorId: userId,
    },
  });
};

export const toggleRequest = async (requestId: string, status: FriendStatus): Promise<void> => {
  await MyriadAPI.request({
    url: `/friends/${requestId}`,
    method: 'PATCH',
    data: {
      status,
    },
  });
};

export const deleteRequest = async (requestId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/friends/${requestId}`,
    method: 'DELETE',
  });
};

export const blockedUser = async (requesteeId: string, userId: string): Promise<void> => {
  await MyriadAPI.request({
    url: '/friends',
    method: 'POST',
    data: {
      status: 'blocked',
      requesteeId: requesteeId,
      requestorId: userId,
    },
  });
};
