export interface SignInCredential {
  name: string;
  anonymous: boolean;
  token: string;
  nonce: number;
  encryptionNonce: Uint8Array;
  signature: string;
  address: string;
}
export interface UserSession {
  token?: string;
  nonce?: number;
  encryptionNonce?: Uint8Array;
  signature?: string;
  name: string;
  profilePictureURL?: string;
  anonymous: boolean;
  welcome: boolean;
  address: string;
}
