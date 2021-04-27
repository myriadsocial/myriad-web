import { People } from './people';

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
