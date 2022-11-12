import {User} from 'next-auth';

import {EncryptionPayload} from '../crypto';

import {SignInCredential, SignInWithEmailCredential} from 'src/interfaces/session';

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

export const emailCredentialToSession = (
  emailCredential: SignInWithEmailCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    id: null,
    name: emailCredential.name,
    username: emailCredential.username,
    email: emailCredential.email,
    loginToken: emailCredential.loginToken,
    token: encryption.encryptedMessage,
    anonymous: false,
    address: '',
    nonce: null,
  };

  return session;
};
