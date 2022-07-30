import FirebaseApp from './app';

import firebase from 'firebase/app';
import 'firebase/messaging';
import localforage from 'localforage';
import {NotificationProps} from 'src/interfaces/notification';

export const init = async (onMessage?: (payload?: NotificationProps) => void) => {
  FirebaseApp.init();

  const messaging = firebase.messaging();
  const token = await messaging.getToken();

  await localforage.setItem('fcm_token', token);

  messaging.onMessage(
    function (payload: any) {
      try {
        const notification: NotificationProps = JSON.parse(payload?.data?.body);

        navigator.serviceWorker
          .getRegistration('/firebase-cloud-messaging-push-scope')
          .then(registration => {
            registration.showNotification(payload.notification.title, payload.notification);
          });

        onMessage && onMessage(notification);
        // eslint-disable-next-line no-empty
      } catch (error) {
        onMessage && onMessage();
      }
    },
    error => {
      console.error('onMessageListener error', error);
    },
  );

  return token;
};

export const unregister = async () => {
  const messaging = firebase.messaging();

  messaging.deleteToken();
  await localforage.removeItem('fcm_token');
};
