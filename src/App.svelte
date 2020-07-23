<script lang="ts">
	import { text } from "svelte/internal";
	import Form from './Form.svelte';
	import Cars from './Cars.svelte';
	

	
	let mapDisplayed : boolean = false;
	let address : string = "7461 rue chambord";
	let distance : number = 500;
	

	function displayMap(event) {
		mapDisplayed = !mapDisplayed
		distance = event.detail.distance;
		address = event.detail.address;
	}
</script>

<main>
	<h1 class="text-commugreen text-xl mb-5">Flex Finder</h1>
	{#if mapDisplayed}
		<div>
			<button on:click={() => {mapDisplayed = !mapDisplayed}} class="bg-commugreen hover:bg-commugreen-dark text-gray-800 py-2 px-4 rounded inline-flex items-center mb-3">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"/></svg>
				<span>Change address</span>
			</button>
			<Cars address={address} distance={distance}/>

		</div>
	{:else}
		<Form address={address} distance={distance} on:message={displayMap}/>
	{/if}
		
		
	</main>
	