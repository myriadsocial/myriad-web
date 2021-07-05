import Axios from 'axios';
import { User, ExtendedUser, UserCredential } from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getUserDetail = async (id: string): Promise<ExtendedUser> => {
  //console.log('getUserDetail');
  const { data } = await MyriadAPI.request<ExtendedUser>({
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
                  relation: 'people'
                }
              ]
            }
          }
        ]
      }
    }
  });

  return data;
};

export const getUserByAddress = async (address: string[]) => {
  const { data } = await MyriadAPI.request<User[]>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          id: {
            inq: address
          }
        }
      }
    }
  });

  return data;
};

export const createUser = async (values: Partial<User>): Promise<User> => {
  const { data } = await MyriadAPI.request<User>({
    url: '/users',
    method: 'POST',
    data: values
  });

  return data;
};

export const updateUser = async (userId: string, values: Partial<User>): Promise<User> => {
  const { data } = await MyriadAPI.request<User>({
    url: `/users/${userId}`,
    method: 'PATCH',
    data: values
  });

  return data;
};

export const addUserCredential = async (userId: string, values: Partial<UserCredential>) => {
  await MyriadAPI({
    url: `/users/${userId}/user-credentials`,
    method: 'POST',
    data: values
  });
};

export const verifyCredentials = async (userId: string, peopleId: string) => {
  await MyriadAPI({
    method: 'POST',
    url: '/user-credentials/verify',
    data: {
      userId,
      peopleId
    }
  });
};

export const disconnectSocial = async (credentialId: string) => {
  const { data } = await MyriadAPI.request({
    method: 'DELETE',
    url: `/user-credentials/${credentialId}`
  });

  return data;
};

export const search = async (query: string) => {
  const { data } = await MyriadAPI.request<User[]>({
    url: '/users',
    method: 'GET',
    params: {
      filter: {
        where: {
          name: {
            like: `${query}.*`,
            options: 'i'
          }
        }
      }
    }
  });

  return data;
};
