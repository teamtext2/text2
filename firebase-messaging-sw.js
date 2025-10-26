importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDKpLKsutFknVxJcGiGam5EfsyzdBO7YKI",
  authDomain: "noti-fcd25.firebaseapp.com",
  projectId: "noti-fcd25",
  storageBucket: "noti-fcd25.firebasestorage.app",
  messagingSenderId: "667248877821",
  appId: "1:667248877821:web:33379feaf8e1db83e71e94",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📢 Thông báo chạy nền:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logoc.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
