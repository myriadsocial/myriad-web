import {Transaction} from 'src/interfaces/transaction';

const UNKNOWN_ACCOUNT = 'unknown';

export const getTipperUserName = (transaction: Transaction): string => {
  if (transaction.from === UNKNOWN_ACCOUNT || !transaction.fromWallet) {
    return 'Anonymous user';
  }

  return transaction.fromWallet.user.name;
};
