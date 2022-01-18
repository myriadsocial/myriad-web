import {UserSession, SignInCredential} from 'src/interfaces/session';
import {ActivityLogType, User} from 'src/interfaces/user';

export const userToSession = (user: User): UserSession => {
  const session: UserSession = {
    anonymous: false,
    name: user.name,
    address: user.id,
    profilePictureURL: user.profilePictureURL || '',
    welcome: user.activityLogs
      ? user.activityLogs.filter(log =>
          [ActivityLogType.SKIP, ActivityLogType.USERNAME].includes(log.type),
        ).length === 0
      : true,
  };

  return session;
};

export const credentialToSession = (credential: SignInCredential): UserSession => {
  const session: UserSession = {
    token: credential.token,
    address: credential.address,
    anonymous: credential.anonymous,
    name: credential.name,
    profilePictureURL: '',
    welcome: false,
  };

  return session;
};
