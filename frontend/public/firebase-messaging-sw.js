
console.log("Exists")
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
 const firebaseConfig = {
    apiKey: "AIzaSyDBQ87ZgLA7P334aFgKxt9Js5aJKy1CR_E",
    authDomain: "restaurantqr-6b5f0.firebaseapp.com",
    projectId: "restaurantqr-6b5f0",
    storageBucket: "restaurantqr-6b5f0.appspot.com",
    messagingSenderId: "964313822128",
    appId: "1:964313822128:web:bf225ae1f07d8eb1d79c75",
    measurementId: "G-0GB769W0C2"
  };

firebase.initializeApp(firebaseConfig);
const ShowFoodStatusUpdate = (data)=>{
  const notificationTitle = 'Status Update';
  const notificationOptions = {
    body: 'Your Order is now ' + data.status,
    icon: '/menu.png'
    };
  console.log('reg',self.registration)
  const not = new Notification(notificationTitle,notificationOptions);

}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
   if(payload.data.type === "food-status"){
      ShowFoodStatusUpdate(payload.data)
   }
  });
console.log("Works")