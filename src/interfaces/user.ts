import { People } from './people';
import { Post } from './post';

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
  profilePictureURL?: string;
  anonymous: boolean;
  createdAt?: Date;
}

export interface ExtendedUser extends User {
  userCredentials: ExtendedUserCredential[];
}

export interface ExtendedUserPost extends User {
  posts: Post[];
}
