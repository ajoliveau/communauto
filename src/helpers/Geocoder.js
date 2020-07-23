
export async function getCoords(address) {
    
    const geocoder = new google.maps.Geocoder();
    return new Promise(function (resolve, reject) {
        geocoder.geocode({ 'componentRestrictions': { 'locality': "Montreal" }, 'address': address }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                const center = results[0].geometry.location;
                resolve(center);
            } else {
                // alert('Geocode was not successful for the following reason: ' + status);
                reject(new Error('Couldnt\'t find the location ' + address));
            }

        })
    })
}


export async function getAddress(coords) {
    const latlng = {
        lat: parseFloat(coords.latitude),
        lng: parseFloat(coords.longitude)
    };
    const geocoder = new google.maps.Geocoder();
    return new Promise(function (resolve, reject) {
        geocoder.geocode({ 'componentRestrictions': { 'locality': "Montreal" }, location: latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                const address = results[0].formatted_address;
                resolve(address);
            } else {
                // alert('Geocode was not successful for the following reason: ' + status);
                reject(new Error('Couldnt\'t find the location'));
            }

        })
    })
}