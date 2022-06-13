export enum ContentType {
  COMMENT = 'comment',
  POST = 'post',
}

export enum WalletTypeEnum {
  POLKADOT = 'polkadot{.js}',
  TRUST = 'trust',
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  NEAR = 'near',
  SENDER = 'sender-wallet',
}

export enum WalletReferenceType {
  USER = 'user',
  PEOPLE = 'people',
  WALLET_ADDRESS = 'wallet_address',
}

export interface WalletDetail {
  referenceId: string;
  referenceType: WalletReferenceType;
  serverId?: string;
  ftIdentifier?: string;
}

export enum BlockchainPlatform {
  SUBSTRATE = 'substrate',
  NEAR = 'near',
}
