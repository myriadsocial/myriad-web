import Axios from 'axios';
import {ExtendedFriend, FriendStatus} from 'src/interfaces/friend';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const LIMIT = 10;

export const getSentRequests = async (userId: string): Promise<ExtendedFriend[]> => {
  const {data} = await MyriadAPI.request<ExtendedFriend[]>({
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

export const getFriendRequests = async (userId: string): Promise<ExtendedFriend[]> => {
  const {data} = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{friendId: userId}, {status: FriendStatus.PENDING}],
        },
        include: ['friend', 'requestor'],
      },
    },
  });

  return data;
};

export const getFriends = async (userId: string, page = 1): Promise<ExtendedFriend[]> => {
  const {data} = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      offset: Math.max(page - 1, 0) * LIMIT,
      limit: LIMIT,
      filter: {
        where: {
          or: [{friendId: userId}, {requestorId: userId}],
          status: FriendStatus.APPROVED,
        },
        include: ['friend', 'requestor'],
      },
    },
  });
  return data;
};

export const searchFriend = async (userId: string, query: string): Promise<ExtendedFriend[]> => {
  const {data} = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          status: FriendStatus.APPROVED,
          or: [{requestorId: userId}, {friendId: userId}],
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
            relation: 'friend',
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

  return data.filter(item => {
    if (item.requestorId === userId) {
      return !!item.friend;
    } else {
      return !!item.requestor;
    }
  });
};

export const checkFriendStatus = async (userIds: string[]): Promise<ExtendedFriend[]> => {
  const {data} = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          or: [
            {
              friendId: {
                inq: userIds,
              },
            },
            {
              requestorId: {
                inq: userIds,
              },
            },
          ],
        },
        include: ['friend', 'requestor'],
      },
    },
  });
  return data;
};

export const sendRequest = async (userId: string, friendId: string): Promise<void> => {
  await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'POST',
    data: {
      status: 'pending',
      friendId,
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
