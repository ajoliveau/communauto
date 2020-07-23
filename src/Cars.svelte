<script lang="ts">
    // import Map from './Map.svelte';
    import { getCoords } from './helpers/Geocoder';
    import { getVehicles } from './helpers/Communauto';    

    import Map from './Map.svelte';    
    import Listing from './Listing.svelte';
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
    $: almostCar = vehiclesFiltered.length > 0 && vehiclesFiltered.filter((vehicle) => {return vehicle.good}).length === 0

    onMount(async () => {        
        center = await getCoords(address);
        vehicles = await getVehicles(center, distance);
        // setBackgroundTask(center, distance);
        firstLoad = false;
        interval = setInterval(async function(){
            if (timer > 0) timer--;            
            // if (timer == 0) syncVehicles();
    	}, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    })

    function filterVehicles(vehicles) {
        const filteredVehicles = vehicles.filter(function(vehicle) {
            return vehicle.good || vehicle.distance <= distance * 1.2;
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
        {#if almostCar}
            <p class="text-m mb-3">There's a car just outside your zone !</p>
        {/if}
        <Map center={center} vehicles={vehiclesFiltered} distance={distance}/>
        <Listing vehicles={vehiclesFiltered}/>
    {/if}
</div>