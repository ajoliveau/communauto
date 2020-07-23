<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let distance : number = 500;
    export let address : string;
    let addressEmpty : boolean = false;
    

	const dispatch = createEventDispatcher();
	// export let distanceM : string;

	// $: distanceM = distance + 'm'

    function validate() {
        if (address) {
            dispatch('message', {
                distance: distance,
                address: address
		    });
        } else {
            addressEmpty = true;
        }
        
    }

</script>

<div class="w-full max-w-xs">
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div class="mb-4">
				<label class="block text-gray-700 text-sm mb-2" for="Address">
					Address
				</label>
                <input bind:value={address} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" class:border-red-500={addressEmpty} id="address" type="text" placeholder="Address">
                {#if addressEmpty}
                    <p class="text-red-500 text-xs italic mt-1">Please enter an address.</p>
                {/if}

			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm mb-2" for="Distance">
					Distance max
				</label>
				<input bind:value={distance} class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="distance" type="number" placeholder="500m">
			</div>
			<div>
				<button on:click={validate} class="bg-commugreen hover:bg-commugreen-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
					Search
				</button>
			</div>
		</form>		
	</div>