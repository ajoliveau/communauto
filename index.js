const DEVELOPMENT = true;


const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const request = require('request');
const fs = require('fs');
const io = require('socket.io').listen(http);
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCuQmpLTsBBC3EyJvNkQJNAu8x4HA9XL4E'
});

app.use(express.static(path.resolve(__dirname + '/client')));

getVehicules();

app.get('/', function (req, res) {
	console.log(__dirname + '/client/homepage.html');
	res.sendFile(__dirname + '/client/homepage.html');
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})


function getVehicules() {

	let voitures;
	if (DEVELOPMENT) {
		let dummyJson = require('./json');
		voitures = dummyJson.Vehicules.map(function(elem) {
			var coords = new googleMapsClient.LatLng(elem.Position.Lat, elem.Position.Lon);
			return {name: elem.Name, coords: coords, data: elem};
		});
	}
	else {
		request.get(
			"http://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals",
			{
				json: true,
				qs: {
					"CustomerID": "", 
					"Longitude": "-73.6143354", 
					"Latitude": "45.5466414"
				}
			},
			(error, response, body) => {
				const data = JSON.parse(body.slice(1,-2));
				if(response.statusCode == 200) {
					voitures = data.Vehicules.map(function(elem) {
						var coords = new googleMapsClient.LatLng(elem.Position.Lat, elem.Position.Lon);
						return {name: elem.Name, coords: coords, data: elem};
					});
				}
			}
		);
	}
}

	// const req = http.request(options, (res) => {


	// console.log("Requete ajax");			
	// // $.ajax({
	// // 	url: "https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals",
	// // 	data: { 
	// // 		"CustomerID": "", 
	// // 		"Longitude": center.lng(), 
	// // 		"Latitude": center.lat()
	// // 	},
	// // 	type: "GET",
	// // 	dataType: "jsonp",
	// // 	crossDomain: true,
	// // 	success: function(data) {
	// // 		console.log(data.Vehicules[0]);
	// // 		voitures = data.Vehicules.map(function(elem) {
	// // 			var coords = new google.maps.LatLng(elem.Position.Lat, elem.Position.Lon);
	// // 			var distance = google.maps.geometry.spherical.computeDistanceBetween(coords, center);
	// // 			var good = (distance <= distanceIdeale ? true : false);
	// // 			return {distance: Math.round(distance), name: elem.Name, coords: coords, good: good, data: elem};
	// // 		});
	// // 		addVehiculeMarkers(voitures);
	// // 	},
	// // 	error: function(xhr) {
	// // 		console.log(xhr);
	// // 	}
	// // });
	
	// $.getJSON('js/json.json', function(data) {
	// 	console.log(data);
	// 	voitures = data.Vehicules.map(function(elem) {
 //    		var coords = new google.maps.LatLng(elem.Position.Lat, elem.Position.Lon);
 //    		var distance = google.maps.geometry.spherical.computeDistanceBetween(coords, center);
 //    		var good = (distance <= distanceIdeale ? true : false);
 //    		return {distance: Math.round(distance), name: elem.Name, coords: coords, good: good};

 //    	}).filter(function(elem) {
 //    		return elem.distance < distanceOsef; 
 //    	});
	// 	addVehiculeMarkers(voitures);
	// });	