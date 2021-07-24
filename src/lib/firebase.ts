import firebase from 'firebase/app';
import 'firebase/messaging';
import localforage from 'localforage';

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
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
