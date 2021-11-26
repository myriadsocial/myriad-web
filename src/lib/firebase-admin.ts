import getConfig from 'next/config';

import admin from 'firebase-admin';

try {
  const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
  admin.initializeApp({
    projectId: publicRuntimeConfig.firebaseProjectId,
    credential: admin.credential.cert({
      projectId: publicRuntimeConfig.firebaseProjectId,
      clientEmail: serverRuntimeConfig.firebaseClientEmail,
      privateKey: serverRuntimeConfig.firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: serverRuntimeConfig.firebaseDatabaseUrl,
    storageBucket: serverRuntimeConfig.firebaseStorageBucket,
  });
  console.log('Initialized.');
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
