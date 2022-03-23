export enum ContentType {
  COMMENT = 'comment',
  POST = 'post',
}

export enum WalletReferenceType {
  WALLET_ADDRESS = 'walletAddress',
}

export interface WalletDetail {
  referenceId: string;
  referenceType: WalletReferenceType;
}
