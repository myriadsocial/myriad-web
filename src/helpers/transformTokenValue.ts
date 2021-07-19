import { Transaction } from 'src/interfaces/transaction';

enum TokenID {
  MYR = 'MYR',
  AUSD = 'AUSD'
}

const basicTransform = (txHistory: Transaction) => {
  let temp = '';
  temp = txHistory.value.toString();
  return temp;
};

export const transformTokenValue = (txHistory: Transaction) => {
  let tokenValue = '';
  const BASE_NUMBER = 10;
  switch (txHistory.tokenId) {
    case TokenID.AUSD:
      tokenValue = basicTransform(txHistory);
      break;
    default:
      tokenValue = (txHistory.value / BASE_NUMBER ** txHistory.token.token_decimal).toString();
  }

  return tokenValue;
};
