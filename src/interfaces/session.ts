export interface SignInCredential {
  id: string;
  username: string;
  email: string;
  address: string;
  instanceURL: string;
  loginType: LoginType;
}

export enum LoginType {
  EMAIL = 'email',
  WALLET = 'wallet',
}
