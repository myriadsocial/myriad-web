/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCz6X_9YOLMC2dhAnU4ql5C3-q5lzx0-9Y',
  projectId: 'myriad-substrate',
  messagingSenderId: '978078580565',
  appId: '1:978078580565:web:db0240e0abc5cb8cb5f9dc'
});

firebase.messaging();
