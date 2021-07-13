import Axios from 'axios';
import { Post } from 'src/interfaces/post';
import { ExtendedUserPost } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getUserProfile = async (id: string): Promise<ExtendedUserPost> => {
  const { data } = await MyriadAPI.request<ExtendedUserPost>({
    url: `users/${id}`,
    method: 'GET'
  });

  return data;
};

export const updateUserProfile = async (id: string, attributes: Partial<User>): Promise<ExtendedUserPost> => {
  const { data } = await MyriadAPI.request<ExtendedUserPost>({
    url: `/users/${id}`,
    method: 'PATCH',
    data: attributes
  });

  return data;
};

export const getPostProfile = async (id: string): Promise<Post[]> => {
  const { data } = await MyriadAPI.request<Post[]>({
    url: `/posts`,
    method: 'GET',
    params: {
      filter: {
        order: `createdAt DESC`,
        where: {
          walletAddress: id
        }
      }
    }
  });

  return data;
};

export const getImportedPost = async (id: string): Promise<Post[]> => {
  const { data } = await MyriadAPI.request<Post[]>({
    url: `/posts`,
    method: 'GET',
    params: {
      filter: {
        order: `createdAt DESC`,
        where: {
          importBy: {
            inq: [id]
          }
        }
      }
    }
  });

  if (data.length > 0) {
    for await (const post of data) {
      if (post.importBy && post.importBy.length > 0) {
        const user = await UserAPI.getUserDetail(post.importBy[0]);

        post.importer = user;
      }
    }
  }

  return data;
};
