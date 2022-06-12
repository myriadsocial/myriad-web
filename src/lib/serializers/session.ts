import {User} from 'next-auth';

import {EncryptionPayload} from '../crypto';

import {SignInCredential} from 'src/interfaces/session';

export const credentialToSession = (
  credential: SignInCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    id: null,
    name: credential.name,
    anonymous: credential.anonymous === 'true',
    address: credential.address,
    token: encryption.encryptedMessage,
    nonce: credential.nonce,
  };

  return session;
};
