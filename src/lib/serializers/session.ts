import {User} from 'next-auth';

import {EncryptionPayload} from '../crypto';

import {SignInCredential} from 'src/interfaces/session';

export const credentialToSession = (
  credential: SignInCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    id: credential.address,
    address: credential.address,
    token: encryption.encryptedMessage,
    instanceURL: credential.instanceURL,
    loginType: credential.loginType,
  };

  return session;
};

export const emailCredentialToSession = (
  credential: SignInCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    id: credential.address,
    token: encryption.encryptedMessage,
    address: credential.address,
    instanceURL: credential.instanceURL,
    loginType: credential.loginType,
  };

  return session;
};
