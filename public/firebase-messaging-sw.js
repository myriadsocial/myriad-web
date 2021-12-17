/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
importScripts('sw-env.js');

firebase.initializeApp({
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

/**
 * --- Installs service worker ---
 */
self.addEventListener('install', event => {
  console.log('Insalling service worker', event);
});

self.addEventListener(
  'notificationclick',
  event => {
    // Event actions derived from event.notification.data from data received
    console.log('Notification clicked', event.notification);
  },
  false,
);

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js][onBackgroundMessage] Received background message ',
    payload,
  );

  const {title, body} = payload.notification;

  // Schedule our own custom notification to show.
  setTimeout(() => {
    const notificationOptions = {
      body,
      icon: 'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg',
    };

    self.registration.showNotification(title, notificationOptions);
  }, 30);

  // Schedule closing all notifications that are not our own.
  // This is necessary because if we don't close the other notifications the
  // default one will appear and we will have duplicate notifications.
  return new Promise(function (resolve) {
    resolve();

    setTimeout(function () {
      self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
          notification.close();
        });
      });
    }, 0);
  });
});
