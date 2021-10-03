import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Comment, CommentProps} from 'src/interfaces/comment';

type CommentList = BaseList<Comment>;

export const loadComments = async (
  referenceId: string,
  excludeUser?: string,
): Promise<CommentList> => {
  let where: Record<string, any> = {
    referenceId,
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
        where,
        include: ['user'],
      },
      pageNumber: 1,
      pageLimit: PAGINATION_LIMIT,
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
