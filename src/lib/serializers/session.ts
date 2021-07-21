import {UserSession, SignInCredential} from 'src/interfaces/session';
import {User, ExtendedUser} from 'src/interfaces/user';

export const userToSession = (user: User | ExtendedUser): UserSession => {
  const session: UserSession = {
    id: user.id,
    anonymous: user.anonymous,
    name: user.name,
    profilePictureURL: user.profilePictureURL || '',
    address: user.id,
    userCredentials: [],
  };

  if ('userCredentials' in user && user.userCredentials) {
    for (const credential of user.userCredentials) {
      session.userCredentials.push({
        accessToken: credential.access_token,
        refreshToken: credential.refresh_token,
        platform: credential.people.platform,
        platformUserId: credential.people.platform_account_id,
        username: credential.people.username,
      });
    }
  }

  return session;
};

export const credentialToSession = (credential: SignInCredential): UserSession => {
  const session: UserSession = {
    anonymous: credential.anonymous,
    name: credential.name,
    profilePictureURL: '',
    address: credential.address,
    userCredentials: [],
  };

  return session;
};
