/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
importScripts('sw-env.js');

firebase.initializeApp({
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const messaging = firebase.messaging();

/**
 * --- Installs service worker ---
 */
self.addEventListener('install', event => {
  console.log('Installing service worker', event);
});

self.addEventListener('notificationclick', event => {
  // Event actions derived from event.notification.data from data received
  console.log('Notification clicked', event.notification);
  const {
    data: {appUrl},
  } = event.notification;
  event.notification.close();
  const promise = new Promise(function (resolve) {
    setTimeout(resolve, 500);
  }).then(function () {
    console.log('doneeeee', appUrl);
    // return the promise returned by openWindow, just in case.
    // Opening any origin only works in Chrome 43+.
    return clients.openWindow(`${appUrl}notification`);
  });

  // Now wait for the promise to keep the permission alive.
  event.waitUntil(promise);
});

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js][onBackgroundMessage] Received background message ',
    payload,
  );

  const {title, body} = payload.data;

  const notificationOptions = {
    body,
    icon: 'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg',
  };

  return self.registration.showNotification(title, notificationOptions);
});
