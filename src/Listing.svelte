<script lang="ts">
    // import Map from './Map.svelte';
    import { getCoords } from './helpers/Geocoder';
    import { getVehicles } from './helpers/Communauto';    
    import Map from './Map.svelte';    
    import { onMount, onDestroy } from 'svelte';    
  
    
    export let distance : number = 500;
    export let address : string;
    
    let firstLoad: boolean = true;
    let syncing: boolean = false;
    let center;
    let vehicles: any[] = [];
    let timerDuration = 60;
    let timer: number = timerDuration;
    let interval;

    $: vehiclesFiltered = filterVehicles(vehicles);

    onMount(async () => {        
        center = await getCoords(address);
        vehicles = await getVehicles(center, distance);
        firstLoad = false;
        interval = setInterval(async function(){
            if (timer > 0) timer--;            
            if (timer == 0) syncVehicles();
    	}, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    })

    function filterVehicles(vehicles) {
        const filteredVehicles = vehicles.filter(function(vehicle) {
            return vehicle.good || vehicle.distance <= distance * 2;
        }).sort(function(a,b): number {
            return a.distance - b.distance;
        });
        if (filteredVehicles.length) {
            displayNotification();
        }
        return filteredVehicles
    }
    
    async function syncVehicles() {
        syncing = true;
        vehicles = await getVehicles(center, distance);
        syncing = false;
        timer = 60;
    }
    
    Notification.requestPermission(function(status) {
    	console.log('Notification permission status:', status);
	});

	function displayNotification() {
		if (Notification.permission == 'granted') {
			navigator.serviceWorker.getRegistration().then(function(reg) {
			reg.showNotification('A car is available');
			});
		}
	}

    
    
</script>

<div>
    {#if firstLoad}
        <p>Loading...</p>
    {:else}
        <div class="flex mb-3">
            {#if syncing}
                <p>Syncing...</p>
            {:else}
                <div class="flex-1">
                    <label class="block text-gray-700 text-sm mb-2" for="progress">Next sync in : {timer}sc</label>
                    <progress max={timerDuration} value={timer}></progress>
                </div>
                <div class="flex-1">
                    <button on:click={syncVehicles} class="bg-commugreen hover:bg-commugreen-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Sync now
                    </button>
                </div>
            {/if}
            
        </div>
        <Map center={center} vehicles={vehiclesFiltered} distance={distance}/>
        <table class="w-full text-md bg-white shadow-md rounded mb-4">
            <thead>
                <tr class="border-b">
                    <th></th>
                    <th class="text-left p-3 px-5">Model</th>
                    <th class="text-left p-3 px-5">ID</th>
                    <th class="text-left p-3 px-5">Distance</th>
                    <th class="text-left p-3 px-5">Fuel</th>
                </tr>
            </thead>
            <tbody>
                {#each vehiclesFiltered as vehicle, i (vehicle.name)}
                    <tr class="border-b hover:bg-orange-100" class:bg-gray-100={i%2 == 1}>
                        <td class="p-3 px-5 flex justify-start">
                            <input readonly class="form-checkbox h-5 w-5 text-gray-600" type="checkbox" bind:checked={vehicle.good}/>
                        </td>
                        <td class="p-3 px-5">{vehicle.data.ModelName}</td>
                        <td class="p-3 px-5">{vehicle.name}</td>
                        <td class="p-3 px-5">{vehicle.distance}m</td>
                        <td class="p-3 px-5">{vehicle.energy}%</td>
                    </tr>               
                {/each}
            </tbody>
        </table>
    {/if}
</div>