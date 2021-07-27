export enum ContentType {
  COMMENT = 'comment',
  POST = 'post',
}

export interface WalletDetail {
  postId: string;
  walletAddress: string;
  contentType: ContentType;
}
