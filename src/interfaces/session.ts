export interface SignInCredential {
  name: string;
  anonymous: boolean;
  token: string;
  address: string;
}
export interface UserSession {
  token?: string;
  name: string;
  profilePictureURL?: string;
  anonymous: boolean;
  welcome: boolean;
  address: string;
}
