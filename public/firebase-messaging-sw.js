importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyCESa-snxTCrs_qIEq_14IzSWP9afqNVJ4",
    authDomain: "doubletick-ce338.firebaseapp.com",
    databaseURL: "https://doubletick-ce338-default-rtdb.firebaseio.com",
    projectId: "doubletick-ce338",
    storageBucket: "doubletick-ce338.appspot.com",
    messagingSenderId: "562362969658",
    appId: "1:562362969658:web:8b8dea172b82a0dae74f03",
    measurementId: "G-9GYY9WYPEN"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log(
//         "[firebase-messaging-sw.js] Received background message ",
//         payload
//     );
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image,
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener("push", (event) => {
    const payload = event.data.json();
    console.log("payload=", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "https://double-tick-admin.vercel.app/favicon/apple-touch-icon.png",
        actions: [
            {
                action: "open_url",
                title: "Open",
            },
        ],
        data: { slug: payload.data.slug },
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

self.addEventListener("notificationclick", (event) => {
    console.log("event=", event.notification.data.slug);
    if (event.action === "open_url") {
        const urlToOpen = `https://www.doubleticklifestyle.com/notifications/${event.notification.data.slug}`; // Replace with your desired URL
        event.waitUntil(
            clients.openWindow(urlToOpen)
        );
    }
    event.notification.close();
});