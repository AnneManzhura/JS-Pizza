


var PizzaOrder = require("./pizza/PizzaOrder");


var styledMapType = new google.maps.StyledMapType(
    [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#242f3e"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#746855"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#242f3e"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#d59563"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#d59563"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#263c3f"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#6b9a76"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#38414e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#212a37"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9ca5b3"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#746855"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#1f2835"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f3d19c"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2f3948"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#d59563"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#17263c"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#515c6d"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#17263c"
                }
            ]
        }
    ],
    {name: 'Styled Map'});


var map;
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});


function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress")); }
    }); }


function geocodeAddress(adress, callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress},
        function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress")); }
    });
}

function getFullAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var adress = results[0].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            directionsDisplay.setDirections(response);
            callback(null, leg.duration.text);
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

var homeMarker = null;
function setMarker(coordinates) {
    if (homeMarker) {
        homeMarker.setMap(null);
        homeMarker = null;
    }

    homeMarker = new google.maps.Marker({
        position: coordinates,
        map: map,
        icon: "assets/images/home-icon.png"
    });
}

function initialiseMaps() {


    var mapProp = {
        center: new google.maps.LatLng(50.464379,30.519131),
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    };

    var html_element = document.getElementById("googleMap");

    map=new google.maps.Map(html_element, mapProp); //Карта створена і показана

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    var point = new google.maps.LatLng(50.464379,30.519131);

    var marker = new google.maps.Marker({
        position: point,
        map: map,   //map - це змінна карти створена за допомогою new google.maps.Map(...)
        icon: "assets/images/map-icon.png"
    });

    directionsDisplay.setMap(map);

    google.maps.event.addListener(map, 'click',function(me){
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function(err, adress){
            if (!err) {
                $("#inputAdress").val(adress);
                setMarker(coordinates);
                calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, res) {
                    if (res) {
                        $(".timeInfo").text(res);
                        $(".addressInfo").text(adress);
                    } else {
                        $(".timeInfo").text(" невідомий");
                        $(".addressInfo").text(" невідома");
                    }
                });
                PizzaOrder.checkAddress();
            } else {
                console.log("Can't find address")
            }
        })
    });

}

google.maps.event.addDomListener(window, 'load', initialiseMaps);


exports.initialiseMaps=initialiseMaps;
exports.geocodeAddress=geocodeAddress;
exports.setMarker=setMarker;
exports.calculateRoute=calculateRoute;
exports.geocodeLatLng=geocodeLatLng;
exports.getFullAddress = getFullAddress;