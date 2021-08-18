import {Transaction} from 'src/interfaces/transaction';

const UNKNOWN_ACCOUNT = 'unknown';

export const getTipperUserName = (transaction: Transaction): string => {
  if (transaction.from === UNKNOWN_ACCOUNT || !transaction.fromUser) {
    return 'Anonymous user';
  }

  return transaction.fromUser.name;
};
