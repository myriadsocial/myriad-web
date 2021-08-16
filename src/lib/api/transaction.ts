import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Transaction, TransactionProps} from 'src/interfaces/transaction';

type TransactionList = BaseList<Transaction>;

export const storeTransaction = async (values: TransactionProps): Promise<Transaction> => {
  const {data} = await MyriadAPI.request<Transaction>({
    url: '/transactions',
    method: 'POST',
    data: values,
  });

  return data;
};

export const getTransactions = async (
  options: Partial<TransactionProps>,
  page?: number,
): Promise<TransactionList> => {
  const where: Partial<Record<keyof TransactionProps, any>> = {};
  let whereWithOr = {};
  const include: Array<string> = [];

  if (options.postId) {
    where.postId = {eq: options.postId};
  }

  if (options.to) {
    where.to = {eq: options.to};
  }

  if (options.to === options.from) {
    whereWithOr = {or: [{to: options.to}, {from: options.from}]};
    include.push('fromUser', 'toUser');
  }

  if (options.currencyId) {
    where.currencyId = {eq: options.currencyId};
  }

  const {data} = await MyriadAPI.request<TransactionList>({
    url: '/transactions',
    method: 'GET',
    params: {
      filter: {
        page,
        limit: PAGINATION_LIMIT,
        order: `createdAt DESC`,
        where: options.to === options.from ? whereWithOr : where,
        include,
      },
    },
  });

  return data;
};

export const removeTransaction = async (transactionId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/transactions/${transactionId}`,
    method: 'DELETE',
  });
};
