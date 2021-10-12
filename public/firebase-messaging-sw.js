/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');
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
