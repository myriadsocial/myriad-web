export interface SignInCredential {
  name: string;
  anonymous: boolean;
  token: string;
}
export interface UserSession {
  token?: string;
  name: string;
  profilePictureURL?: string;
  anonymous: boolean;
  welcome: boolean;
}
