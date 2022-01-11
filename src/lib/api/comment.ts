import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';

type CommentList = BaseList<Comment>;

export const loadComments = async (
  pageNumber: number,
  referenceId: string,
  section?: SectionType,
  excludeUser?: string,
): Promise<CommentList> => {
  let where: Record<string, any> = {
    referenceId,
  };

  if (section) {
    where = {
      ...where,
      section: {
        eq: section,
      },
    };
  }

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
        include: ['user', 'votes'],
      },
      pageNumber: pageNumber,
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
