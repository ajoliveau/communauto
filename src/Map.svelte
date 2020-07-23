<script lang="ts">
    import { onMount } from 'svelte';
    
    export let center;
    export let vehicles: any[];
    export let distance:number;
    
    let markersArray;
    let map;
    
    $: addVehiculeMarkers(vehicles, map);
    
    onMount(async () => {
        initMap();             
    });
    
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 15,
            disableDefaultUI: true
        });
        const centerMarker = new google.maps.Marker({
            map: map,
            position: center
        });
        centerMarker.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png');
        drawCircle();
    }
    
    function drawCircle() {
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: distance
        });
        return cityCircle;
    }
    
    function addVehiculeMarkers(vehicles, map, markersArray) {
        vehicles.forEach(function(elem) {

            const latlng = {
                lat: parseFloat(elem.coords.latitude),
                lng: parseFloat(elem.coords.longitude)
            };
            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });

            
            markersArray = [...markersArray , marker];
            
            var infoWindow = new google.maps.InfoWindow({
                content: createInfoWindow(elem)
            });
            
            marker.addListener('click', function(){
                infoWindow.open(map, marker);
            });
            
            
            if (elem.good) {
                marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                // marker.setAnimation(google.maps.Animation.BOUNCE);                
            }
            
        });
        
    }
    
    function createInfoWindow(voiture) {            
        var resultat = 
        '<div><b>'+
            'Voiture ' + voiture.data.Name + ' ' + voiture.data.ModelName + '</b><br/>' +
            'Distance : ' + voiture.distance + ' metres' +
            '</div>' + 
            '<div class="book_LSI" id="book_LSI_' + voiture.data.Id + '"><a href="#" onClick="javascript:BookLSI (\'' + voiture.data.Id + '\', \'' + voiture.data.Name + '\', \'' + voiture.data.ModelName.toLowerCase() + '\', \'' + voiture.data.Immat + '\', \'XstrAddress2X\', \'Xcharge2X\', \'XnbrHourX\', \'' + voiture.coords.latitude + '\', \'' + voiture.coords.longitude + '\');">Sélectionner ce véhicule'+'</a></div>';
            ; 	
            return resultat;
        }
        
        function clearMarkers() {
            markersArray = [];
        }
        
    </script>
    
    <style>
        #map {
            height:80vh;
            width: 90vw;
        }
    </style>
    
    <div class="">
        <div id="map" class=""></div>            
    </div>
    