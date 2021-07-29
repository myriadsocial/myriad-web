import {Transaction} from 'src/interfaces/transaction';

enum TokenID {
  MYRIA = 'MYRIA',
  AUSD = 'AUSD',
}

const basicTransform = (txHistory: Transaction) => {
  let temp = '';
  temp = txHistory.value.toString();
  return temp;
};

const transformValueForMYRIA = (txHistory: Transaction) => {
  let temp = '';
  const BASE_NUMBER = 10;
  if (!txHistory.token) {
    temp = 'Decimals N/A';
    return temp;
  }

  temp = (txHistory.value / BASE_NUMBER ** txHistory.token.token_decimal).toString();
  return temp;
};

export const transformTokenValue = (txHistory: Transaction) => {
  let tokenValue = '';
  switch (txHistory.tokenId) {
    case TokenID.AUSD:
      tokenValue = basicTransform(txHistory);
      break;
    default:
      tokenValue = transformValueForMYRIA(txHistory);
  }

  return tokenValue;
};
