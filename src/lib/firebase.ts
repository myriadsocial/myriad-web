import getConfig from 'next/config';

import firebase from 'firebase/app';
import 'firebase/messaging';
import localforage from 'localforage';

const {publicRuntimeConfig} = getConfig();

const firebaseCloudMessaging = {
  getToken: async (): Promise<string | null> => {
    return localforage.getItem('fcm_token');
  },

  removeToken: async (): Promise<void> => {
    await localforage.removeItem('fcm_token');
  },

  init: async function (): Promise<void | boolean> {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: publicRuntimeConfig.firebaseAPIKey,
        projectId: publicRuntimeConfig.firebaseProjectId,
        messagingSenderId: publicRuntimeConfig.firebaseMessagingSenderId,
        appId: publicRuntimeConfig.firebaseAppId,
      });
    }

    try {
      if ((await this.getToken()) !== null) {
        return false;
      }

      const messaging = firebase.messaging();

      messaging.onMessage(function (payload) {
        console.log('Message received', payload);
      });

      await Notification.requestPermission();

      const token = await messaging.getToken();

      localforage.setItem('fcm_token', token);
    } catch (error) {
      console.error(error);
    }
  },
};

export {firebaseCloudMessaging};
