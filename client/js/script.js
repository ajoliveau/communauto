var map;
var geocoder;
var voitures;
var circle;

var distanceIdeale = 500;
var distanceOsef = 4000;
var center;

var markersArray = [];

var interval;
var count = 0;


$(document).ready(function () {
	$("#dialog").dialog({autoOpen: false});
	$("#distance").on('change', function() {
		distanceIdeale = parseInt($("#distance").val());
		if (circle) {
			circle.setMap(null);
			circle = drawCircle();
		}
		getVehicules();
	});
	$("#search").click(function() {
		initMap();
		geocodeAdress();
	});

});


function geocodeAdress() {
	var adresse = $("#adresse").val();
	geocoder.geocode({'componentRestrictions': {'locality': "Montreal"}, 'address': adresse}, function (results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			center = results[0].geometry.location;
			map.setCenter(center);
			var centerMarker = new google.maps.Marker({
				map: map,
				position: center
			});
			centerMarker.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png');
			circle = drawCircle();
			getVehicules();


		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}

	});
}


function getVehicules() {

	console.log("Requete ajax");			
	// $.ajax({
	// 	url: "https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals",
	// 	data: { 
	// 		"CustomerID": "", 
	// 		"Longitude": center.lng(), 
	// 		"Latitude": center.lat()
	// 	},
	// 	type: "GET",
	// 	dataType: "jsonp",
	// 	crossDomain: true,
	// 	success: function(data) {
	// 		console.log(data.Vehicules[0]);
	// 		voitures = data.Vehicules.map(function(elem) {
	// 			var coords = new google.maps.LatLng(elem.Position.Lat, elem.Position.Lon);
	// 			var distance = google.maps.geometry.spherical.computeDistanceBetween(coords, center);
	// 			var good = (distance <= distanceIdeale ? true : false);
	// 			return {distance: Math.round(distance), name: elem.Name, coords: coords, good: good, data: elem};
	// 		});
	// 		addVehiculeMarkers(voitures);
	// 	},
	// 	error: function(xhr) {
	// 		console.log(xhr);
	// 	}
	// });
	
	$.getJSON('js/json.json', function(data) {
		console.log(data);
		voitures = data.Vehicules.map(function(elem) {
    		var coords = new google.maps.LatLng(elem.Position.Lat, elem.Position.Lon);
    		var distance = google.maps.geometry.spherical.computeDistanceBetween(coords, center);
    		var good = (distance <= distanceIdeale ? true : false);
    		return {distance: Math.round(distance), name: elem.Name, coords: coords, good: good};

    	}).filter(function(elem) {
    		return elem.distance < distanceOsef; 
    	});
		addVehiculeMarkers(voitures);
	});	
}


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 15
	});
	geocoder = new google.maps.Geocoder();
	window.setInterval(function(){
		if($("#dialog").dialog('isOpen'))
			$("#dialog").dialog('close');
		
		getVehicules();
	}, 500000);
}

function drawCircle() {
	var cityCircle = new google.maps.Circle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: map,
		center: map.center,
		radius: distanceIdeale
	});
	return cityCircle;
}


function addVehiculeMarkers(voitures) {
	clearMarkers();
	console.log(voitures[0]);
	var allbad = true;
	voitures.forEach(function(elem) {
		var marker = new google.maps.Marker({
			position: elem.coords,
			map: map
		});

		markersArray.push(marker);
		
		var infoWindow = new google.maps.InfoWindow({
			content: createInfoWindow(elem)
		});

		marker.addListener('click', function(){
			infoWindow.open(map, marker);
		});


		if (elem.good) {
			allbad = false;
			marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
			marker.setAnimation(google.maps.Animation.BOUNCE);
			$("#dialog").dialog('open');
			clearInterval(interval);

			interval = setInterval(function() {
				$("#favicon").attr("href", "favicon"+ count +".ico");
				count = (count+1)%2;
			}, 1000);
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', 'ding.mp3');
			audioElement.play();
		}
		
	});

	if (allbad) {
		clearInterval(interval);
		$("#favicon").attr("href", "favicon.ico");
	}
}

function createInfoWindow(voiture) {
	var resultat = 
	'<div><b>'+
	'Voiture ' + voiture.Id + '</b><br/>' +
	'Distance : ' + voiture.distance + ' metres' +
	'</div>' + 
	'<div class="book_LSI" id="book_LSI_' + voiture.data.Id + '"><a href="#" onClick="javascript:BookLSI (\'' + voiture.data.Id + '\', \'' + voiture.data.Name + '\', \'' + voiture.data.ModelName.toLowerCase() + '\', \'' + voiture.data.Immat + '\', \'XstrAddress2X\', \'Xcharge2X\', \'XnbrHourX\', \'' + voiture.coords.lat() + '\', \'' + voiture.coords.lng() + '\');">Sélectionner ce véhicule'+'</a></div>';
	; 	
	return resultat;


}

function BookLSI (vin, carNo, modelName, licensePlate, address, charge, nbrHour, lat, lng) {
	var lang = 1;
	$.ajax({
		url: 'https://www.reservauto.net/Scripts/Client/Ajax/Mobile/Login.asp',
		type: 'GET',
		data: {URLEnd: 'URLEnd'},
		dataType: 'jsonp',
		crossdomain: true,
		contentType: 'application/json; charset=utf-8',
		success: function(data){
			var CustomerID = parseInt (data.data[0].CustomerID, 10);
			var ProviderNo = data.data[0].ProviderNo;
				// modif Eric 
				var cityID = $('#ville').val();
				// end  modif Eric
				var Access = data.data[0].Access;
				var contButtonLang =(lang == 1)? "Annuler" : "Cancel";

				$.ajax({
					url: 'https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/CreateBooking?Callback=?',
					type: 'GET',
					data: {CustomerID: "\"\"", "VehicleID": "\"" + vin + "\""},
					dataType: 'jsonp',
					crossdomain: true,
					contentType: 'application/json; charset=utf-8',
					success: function(data){
						$('#progressbar').progressbar('destroy');
						$('#progressbar').hide();


						if (data) {
							alert("Yeah !");
						}
						else {
							alert("Marche pas");
						}
					}
				});						
			}
		});


}

function clearMarkers() {
	for(i in markersArray) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}
