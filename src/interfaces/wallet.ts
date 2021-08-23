export enum ContentType {
  COMMENT = 'comment',
  POST = 'post',
}

export interface WalletDetail {
  referenceId: string;
  walletAddress: string;
  contentType: ContentType;
}
