import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {FilterParams, PaginationParams} from './interfaces/pagination-params.interface';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';

type CommentList = BaseList<Comment>;

type CommentListFilterParams = Omit<FilterParams, 'query'> & {
  referenceId: string;
  section?: SectionType;
  excludeUser?: string;
};

export const loadComments = async (
  params: CommentListFilterParams,
  pagination: PaginationParams,
): Promise<CommentList> => {
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;

  let where: Record<string, any> = {
    referenceId: params.referenceId,
  };

  if (params.section) {
    where = {
      ...where,
      section: {
        eq: params.section,
      },
    };
  }

  if (params.excludeUser) {
    where = {
      ...where,
      userId: {
        neq: params.excludeUser,
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
        order: [`${orderField} ${sort}`],
      },
      pageNumber: page,
      pageLimit: limit,
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

export const remove = async (commentId: string): Promise<Comment> => {
  const {data} = await MyriadAPI.request<Comment>({
    url: `/comments/${commentId}`,
    method: 'DELETE',
  });

  return data;
};

export const loadUserComments = async (
  userId: string,
  pagination: PaginationParams,
): Promise<CommentList> => {
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;

  const where: Record<string, any> = {
    userId,
  };

  const {data} = await MyriadAPI.request<CommentList>({
    url: `/comments`,
    method: 'GET',
    params: {
      filter: {
        where,
        include: [
          'user',
          {
            relation: 'post',
            scope: {
              include: [
                {
                  relation: 'user',
                },
              ],
            },
          },
        ],
        order: [`${orderField} ${sort}`],
      },
      pageNumber: page,
      pageLimit: limit,
    },
  });

  return data;
};
