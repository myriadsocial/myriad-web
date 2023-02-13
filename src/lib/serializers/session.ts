import {User} from 'next-auth';

import {EncryptionPayload} from '../crypto';

import {SignInCredential} from 'src/interfaces/session';

export const credentialToSession = (
  credential: SignInCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    id: credential.id,
    username: credential.username,
    email: credential.email,
    address: credential.address,
    token: encryption.encryptedMessage,
    instanceURL: credential.instanceURL,
    loginType: credential.loginType,
  };

  return session;
};
