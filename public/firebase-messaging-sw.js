/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');
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
  console.log('[firebase-messaging-sw.js][onBackgroundMessage] Received background message ', payload); // debug info

  const { title, body, icon, ...restPayload } = payload.notification;

  const notificationOptions = {
    body,
    icon: icon || 'https://res.cloudinary.com/dsget80gs/image/upload/myriad/myriad-purple-logo.jpg', // path to your "fallback" firebase notification logo
    data: restPayload,
  };

  return self.registration.showNotification(title, notificationOptions);
});

