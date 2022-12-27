export interface ExclusiveContentPost {
  content: {
    text: string;
    rawText?: string;
  };
  contentPrices: {
    currencyId: string;
    amount: number;
  }[];
}
