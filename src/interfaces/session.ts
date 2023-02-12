export interface SignInCredential {
  address: string;
  instanceURL: string;
  loginType: LoginType;
}

export enum LoginType {
  EMAIL = 'email',
  WALLET = 'wallet',
}
