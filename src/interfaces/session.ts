export interface SignInCredential {
  name: string;
  anonymous: boolean;
  token: string;
  nonce: string;
  initVec: string;
  signature: string;
  address: string;
}
export interface UserSession {
  token?: string;
  nonce?: string;
  initVec?: string;
  signature?: string;
  name: string;
  profilePictureURL?: string;
  anonymous: boolean;
  welcome: boolean;
  address: string;
}
