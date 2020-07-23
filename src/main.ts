import App from './App.svelte';

let serviceWorker;

// async function registerServiceWorker() {
// 	if ('serviceWorker' in navigator) {
// 		serviceWorker = await navigator.serviceWorker.register('/service-worker.js')
// 		console.log(serviceWorker);
// 	}	
// }
// registerServiceWorker()

serviceWorker = navigator.serviceWorker.register('/service-worker.js')


const app = new App({
	target: document.body,
	props: {serviceWorker}
});


export default app;