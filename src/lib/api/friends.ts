import Axios from 'axios';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const getSentRequests = async (userId: string): Promise<ExtendedFriend[]> => {
  const { data } = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{ requestorId: userId }, { status: FriendStatus.PENDING }]
        }
      }
    }
  });

  return data;
};

export const getFriendRequests = async (userId: string): Promise<ExtendedFriend[]> => {
  const { data } = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          and: [{ friendId: userId }, { status: FriendStatus.PENDING }]
        },
        include: ['friend', 'requestor']
      }
    }
  });

  return data;
};

export const getFriends = async (userId: string): Promise<ExtendedFriend[]> => {
  const { data } = await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'GET',
    params: {
      filter: {
        where: {
          or: [{ friendId: userId }, { requestorId: userId }],
          status: FriendStatus.APPROVED
        },
        include: ['friend', 'requestor']
      }
    }
  });
  return data;
};

export const sendRequest = async (userId: string, friendId: string): Promise<void> => {
  await MyriadAPI.request<ExtendedFriend[]>({
    url: `/friends`,
    method: 'POST',
    data: {
      friendId,
      requestorId: userId
    }
  });
};

export const toggleRequest = async (requestId: string, status: FriendStatus): Promise<void> => {
  await MyriadAPI.request({
    url: `/friends/${requestId}`,
    method: 'PATCH',
    data: {
      status
    }
  });
};
