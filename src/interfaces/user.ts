import {Sizes} from './assets';
import {People} from './people';
import {Post} from './post';

export interface UserCredential {
  id: string;
  access_token: string;
  refresh_token: string;
  peopleId: string;
  userId: string;
}

export interface ExtendedUserCredential extends UserCredential {
  people: People;
}

export interface User {
  id: string;
  bio?: string;
  name: string;
  username: string;
  profilePictureURL?: string;
  profile_picture?: {
    sizes: Sizes;
  };
  bannerImageUrl?: string;
  anonymous: boolean;
  fcmTokens?: string[];
  skip_tour?: boolean;
  createdAt?: Date;
}

export interface ExtendedUser extends User {
  userCredentials?: ExtendedUserCredential[];
}

export interface ExtendedUserPost extends User {
  posts: Post[];
}

export interface UserTransactionDetail {
  id: string;
  sentToMe: number;
  sentToThem: number;
  userId: string;
  tokenId: string;
}
