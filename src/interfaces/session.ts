import {SocialsEnum} from './social';

export interface SignInCredential {
  address: string;
  name: string;
  anonymous: boolean;
}

interface SessionCredential {
  platform: SocialsEnum;
  platformUserId: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserSession {
  id?: string;
  name: string;
  profilePictureURL: string;
  address: string;
  anonymous: boolean;
  userCredentials: SessionCredential[];
}
