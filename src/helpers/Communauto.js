import jsonp from 'jsonp';
import { getDistance } from 'geolib';

export async function getVehicles(center, targetDistance) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://www.reservauto.net/WCF/LSI/Cache/LSIBookingService.svc/GetVehicleProposals';
    let data = await fetch(proxyUrl + targetUrl);
    data = await data.json();
    data = data.Vehicules.map(function (elem) {
        const coordsVehicle = { latitude: elem.Position.Lat, longitude: elem.Position.Lon };
        const coordsUser = { latitude: center.lat(), longitude: center.lng() };
        
        var distance = getDistance(coordsVehicle, coordsUser);
        var good = (distance <= targetDistance ? true : false);
        return { distance: Math.round(distance), name: elem.Name, coords: coordsVehicle, good: good, data: elem, energy: elem.EnergyLevel, id: elem.Id };
    });

    return Object.values(data);    
}