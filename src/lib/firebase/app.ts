import getConfig from 'next/config';

import firebase from 'firebase/app';

const {publicRuntimeConfig} = getConfig();

const FirebaseApp = {
  init: () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: publicRuntimeConfig.firebaseAPIKey,
        projectId: publicRuntimeConfig.firebaseProjectId,
        messagingSenderId: publicRuntimeConfig.firebaseMessagingSenderId,
        appId: publicRuntimeConfig.firebaseAppId,
        measurementId: publicRuntimeConfig.firebaseMeasurementId,
      });
    }
  },
};

export default FirebaseApp;
