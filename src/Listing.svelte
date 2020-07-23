<script lang="ts">    
    export let vehicles: any[];
</script>

<div>
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
            {#each vehicles as vehicle, i (vehicle.name)}
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
</div>