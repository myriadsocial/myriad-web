export interface SignInCredential {
  token: string;
  initVec: string;
  nonce: number;
  signature: string;
  name: string;
  anonymous: boolean;
  address: string;
  publicAddress: string;
}
export interface UserSession {
  token?: string;
  initVec?: string;
  nonce?: number;
  signature?: string;
  name: string;
  profilePictureURL?: string;
  publicAddress: string;
  anonymous: boolean;
  welcome: boolean;
  address: string;
}
