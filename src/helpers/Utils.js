import { getVehicles } from './helpers/Communauto';    

export function setBackgroundTask(center, distance) {
    Notification.requestPermission(function (status) {
        console.log('Notification permission status:', status);        
    });

    getVehicles(center, distance)




}




async function triggerPushNotification() {
    const serviceWorker = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    const publicVapidKey = "BGxJu2EE6P_6Bdm9l_qRel8M9bagTvmy0SJFdkBj6fgwXcE7jsiQvO_SdYBfGqhZaRDws2zS2L0T_3IU3vsRnsI";
    await navigator.serviceWorker.ready
    const subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),

    });

    console.log(subscription.endpoint)
    await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        credentials: 'omit',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}