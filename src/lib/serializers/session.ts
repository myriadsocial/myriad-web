import {UserSession, SignInCredential} from 'src/interfaces/session';
import {User} from 'src/interfaces/user';

export const userToSession = (user: User): UserSession => {
  const session: UserSession = {
    anonymous: false,
    name: user.name,
    profilePictureURL: user.profilePictureURL || '',
    address: user.id,
  };

  return session;
};

export const credentialToSession = (credential: SignInCredential): UserSession => {
  const session: UserSession = {
    anonymous: credential.anonymous,
    name: credential.name,
    profilePictureURL: '',
    address: credential.address,
  };

  return session;
};
