import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import Axios from 'axios';
import {Comment, CommentProps} from 'src/interfaces/comment';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_LATEST_API_URL,
});

type CommentList = BaseList<Comment>;

export const loadComments = async (postId: string, excludeUser?: string): Promise<CommentList> => {
  let where: Record<string, any> = {
    postId,
  };

  if (excludeUser) {
    where = {
      ...where,
      userId: {
        neq: excludeUser,
      },
    };
  }

  const {data} = await MyriadAPI.request<CommentList>({
    url: `/comments`,
    method: 'GET',
    params: {
      filter: {
        page: 1,
        limit: PAGINATION_LIMIT,
        where,
        include: ['user'],
      },
    },
  });

  return data;
};

export const reply = async (comment: CommentProps): Promise<Comment> => {
  const {data} = await MyriadAPI.request<Comment>({
    url: `/comments`,
    method: 'POST',
    data: comment,
  });

  return data;
};
