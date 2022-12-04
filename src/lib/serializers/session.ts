import {User} from 'next-auth';

import {EncryptionPayload} from '../crypto';

import {SignInCredential} from 'src/interfaces/session';

export const credentialToSession = (
  credential: SignInCredential,
  encryption: EncryptionPayload,
): User => {
  const session: User = {
    // User detail
    id: credential.id,
    username: credential.username,
    email: credential.email,
    address: credential.address,

    // Login detail
    token: encryption.encryptedMessage,
    instanceURL: credential.instanceURL,
    walletType: credential.walletType,
    networkType: credential.networkType,
    loginType: credential.loginType,

    // Blockchain detail
    walletType: credential.walletType,
    networkType: credential.networkType,
    blockchainPlatform: credential.blockchainPlatform,
  };

  return session;
};
