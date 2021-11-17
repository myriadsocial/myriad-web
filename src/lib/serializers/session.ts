import {UserSession, SignInCredential} from 'src/interfaces/session';
import {ActivityLogType, User} from 'src/interfaces/user';

export const userToSession = (user: User): UserSession => {
  const session: UserSession = {
    anonymous: false,
    name: user.name,
    profilePictureURL: user.profilePictureURL || '',
    address: user.id,
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
    anonymous: credential.anonymous,
    name: credential.name,
    profilePictureURL: '',
    address: credential.address,
    welcome: false,
  };

  return session;
};
