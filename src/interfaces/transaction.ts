export interface Transaction {
  trxHash: string;
  from: string;
  to: string;
  value: number;
  state: string;
  tokenId: string;
}
