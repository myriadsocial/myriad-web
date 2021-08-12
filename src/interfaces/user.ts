import {People} from './people';
import {Post} from './post';

export interface UserSocialMedia {
  id: string;
  verified: boolean;
  platform: string;
  peopleId: string;
  userId: string;
}

export interface ExtendedUserSocialMedia extends UserSocialMedia {
  people: People;
}

export interface User {
  id: string;
  bio?: string;
  name: string;
  profilePictureURL?: string;
  bannerImageUrl?: string;
  fcmTokens?: string[];
  createdAt?: Date;
}

export interface ExtendedUser extends User {
  userSocialMedias?: ExtendedUserSocialMedia[];
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
