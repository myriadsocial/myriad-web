import {UserSession, SignInCredential} from 'src/interfaces/session';
import {User, ExtendedUser} from 'src/interfaces/user';

export const userToSession = (user: User | ExtendedUser): UserSession => {
  const session: UserSession = {
    id: user.id,
    anonymous: false,
    name: user.name,
    profilePictureURL: user.profilePictureURL || '',
    address: user.id,
    userSocialMedias: [],
  };

  if ('userSocialMedias' in user && user.userSocialMedias) {
    for (const credential of user.userSocialMedias) {
      session.userSocialMedias.push({
        platform: credential.people.platform,
        platformUserId: credential.people.originUserId,
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
    userSocialMedias: [],
  };

  return session;
};
