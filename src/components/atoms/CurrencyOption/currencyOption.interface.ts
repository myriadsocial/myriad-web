export type Props = {
  currencies: Currency[];
};
// TEMP INTERFACE DELETE THIS IF NO NEED
interface Currency {
  key: number;
  tokenSymbol: string;
  tokenImage: string;
  balance: string;
}
