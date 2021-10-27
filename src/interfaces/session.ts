export interface SignInCredential {
  address: string;
  name: string;
  anonymous: boolean;
}
export interface UserSession {
  name: string;
  profilePictureURL?: string;
  address: string;
  anonymous: boolean;
  welcome: boolean;
}
