import Axios from 'axios';
import {User, ExtendedUser, UserCredential, UserTransactionDetail} from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getUserDetail = async (id: string): Promise<ExtendedUser> => {
  const {data} = await MyriadAPI.request<ExtendedUser>({
    url: `users/${id}`,
    method: 'GET',
    params: {
      filter: {
        include: [
          {
            relation: 'userCredentials',
            scope: {
              include: [
                {
                  relation: 'people',
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

export const getUserByAddress = async (address: string[]): Promise<User[]> => {
  const {data} = await MyriadAPI.request<User[]>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          id: {
            inq: address,
          },
        },
      },
    },
  });

  return data;
};

export const createUser = async (values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI.request<User>({
    url: '/users',
    method: 'POST',
    data: values,
  });

  return data;
};

export const updateUser = async (userId: string, values: Partial<User>): Promise<User> => {
  const {data} = await MyriadAPI.request<User>({
    url: `/users/${userId}`,
    method: 'PATCH',
    data: values,
  });

  return data;
};

export const addUserCredential = async (
  userId: string,
  values: Partial<UserCredential>,
): Promise<void> => {
  await MyriadAPI({
    url: `/users/${userId}/user-credentials`,
    method: 'POST',
    data: values,
  });
};

export const verifyCredentials = async (userId: string, peopleId: string): Promise<void> => {
  await MyriadAPI({
    method: 'POST',
    url: '/user-credentials/verify',
    data: {
      userId,
      peopleId,
    },
  });
};

export const verifySocialAccount = async (
  username: string,
  platform: string,
  publicKey: string,
): Promise<void> => {
  await MyriadAPI.request({
    method: 'POST',
    url: '/verify',
    data: {
      username,
      platform,
      publicKey,
    },
  });
};

export const disconnectSocial = async (credentialId: string): Promise<void> => {
  await MyriadAPI.request({
    method: 'DELETE',
    url: `/user-credentials/${credentialId}`,
  });
};

export const search = async (query: string): Promise<User[]> => {
  const {data} = await MyriadAPI.request<User[]>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          name: {
            like: `${query}.*`,
            options: 'i',
          },
        },
      },
    },
  });

  return data;
};

export const getUserTransactionDetails = async (id: string): Promise<UserTransactionDetail[]> => {
  const {data} = await MyriadAPI.request<UserTransactionDetail[]>({
    url: `/users/${id}/detail-transactions`,
    method: 'GET',
  });

  return data;
};
