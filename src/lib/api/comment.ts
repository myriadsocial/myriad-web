import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {FilterParams, PaginationParams} from './interfaces/pagination-params.interface';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {WalletDetail} from 'src/interfaces/wallet';

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
  const filterParams: Record<string, any> = {
    include: [
      'votes',
      'post',
      {
        relation: 'user',
        scope: {
          include: [{relation: 'wallets'}],
        },
      },
    ],
    order: [`${orderField} ${sort}`],
  };

  const commentParams: Record<string, any> = {
    filter: filterParams,
    referenceId: params.referenceId,
    pageNumber: page,
    pageLimit: limit,
  };

  if (params.section) {
    commentParams.section = params.section;
  }

  const {data} = await MyriadAPI().request<CommentList>({
    url: `/user/comments`,
    method: 'GET',
    params: commentParams,
  });

  return data;
};

export const reply = async (comment: CommentProps): Promise<Comment> => {
  const {data} = await MyriadAPI().request<Comment>({
    url: `/user/comments`,
    method: 'POST',
    data: comment,
  });

  return data;
};

export const remove = async (commentId: string): Promise<Comment> => {
  const {data} = await MyriadAPI().request<Comment>({
    url: `/user/comments/${commentId}`,
    method: 'DELETE',
  });

  return data;
};

// Comment in profile
export const loadUserComments = async (
  userId: string,
  pagination: PaginationParams,
): Promise<CommentList> => {
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;
  const {data} = await MyriadAPI().request<CommentList>({
    url: `/user/comments`,
    method: 'GET',
    params: {
      filter: {
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
      userId,
    },
  });

  return data;
};

export const getWalletAddress = async (commentId: string): Promise<WalletDetail> => {
  const {data} = await MyriadAPI().request<WalletDetail>({
    url: `/comment/${commentId}/walletaddress`,
    method: 'GET',
  });

  return data;
};
