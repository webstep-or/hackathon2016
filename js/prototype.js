
var map = L.map('map', { minZoom: 11, maxZoom: 18 }).setView([58.96, 5.73], 10);

L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}&format=image/png', {
    attribution: '<a href="http://kartverket.no">Kartverket</a>'
}).addTo(map);

var homeIcon = L.icon({
    iconUrl: 'images/home.png',
    iconSize: [50, 50],
    iconAnchor: [15, 20]
});
var workIcon = L.icon({
    iconUrl: 'images/office.png',
    iconSize: [50, 50],
    iconAnchor: [15, 20]
});
var schoolIcon = L.icon({
    iconUrl: 'images/pacifier_blue.png',
    iconSize: [30, 30],
    iconAnchor: [15, 20]
});
var schoolIconWanted = L.icon({
    iconUrl: 'images/pacifier_wanted.png',
    iconSize: [30, 30],
    iconAnchor: [15, 20]
});

var homeMarker = L.marker([0, 0], {
    icon: homeIcon
});

var workMarker = L.marker([0, 0], {
    icon: workIcon
});

var chosenSchool = L.marker([0, 0], {
    icon: schoolIconWanted
});

var wanted = L.layerGroup([homeMarker, chosenSchool, workMarker]);

//L.control.layers.addOverlay(wanted);

//var geocodingAPI = "http://hotell.difi.no/api/json/stavanger/barnehager?";

//var geocodingAPI2 = "http://hotell.difi.no/api/json/stavanger/barnehager?page=2";

var markers = L.markerClusterGroup();

var addBhageToMap = function (json) {


    $.each(json.entries, function (key, bhage) {

        var title = bhage.barnehagens_navn;

        var marker = L.marker([bhage.breddegrad, bhage.lengdegrad], {
            title: title,
            icon: schoolIcon
        });
        marker.bindPopup(title);

        markers.addLayer(marker);

        //L.marker([bhage.breddegrad, bhage.lengdegrad]).addTo(map);

        //console.log(key + ": " + bhage);
    });

    map.addLayer(markers);
    map.addLayer(wanted);

}

//$.getJSON(geocodingAPI, addBhageToMap);
//$.getJSON(geocodingAPI2, addBhageToMap);
$.getJSON('data/barnehager.json', addBhageToMap);


String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

var showResults = function (json) {
    var test = 0;
}

/* Home input */
$('#home').on('keyup change', function () {
    // Your stuff...

    var test = 0;
});

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

var durations = [];

var testfunc = function (yo) {

    durations.push(yo);

    if (durations.length == 3) {
        durations.sort(function (a, b) {
            var sortStatus = 0;

            if (a.distance < b.duration) {
                sortStatus = -1;
            } else if (a.duration > b.duration) {
                sortStatus = 1;
            }

            return sortStatus;
        });

        for (var j = 0; j < 3; j++) {
            var resultsDiv = document.getElementById('results' + j);
            resultsDiv.innerHTML = '';
            resultsDiv.innerHTML = String.format("{0} {1} min", durations[j].name, new Date(durations[j].duration * 1000).getMinutes());

        };
    }
}

var findClosest = function (json) {

    var top = 3;

    //var home = [58.984617, 5.685487];//hjemme
    //var work = [58.966500, 5.730814]; //forusakutten
    //var home = 'Ragbakken 97, 4042 Hafrsfjord';
    //var work = 'Stokkaveien 9, 4313 Sandnes';

    var home = $('#home').val();
    var work = $('#work').val();

    if (home == '' | work == '') {
        return;
    }

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': home }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {


            var distances = [];
            $.each(json.entries, function (key, bhage) {

                distances.push({ name: bhage.barnehagens_navn, distance: distance(bhage.breddegrad, bhage.lengdegrad, results[0].geometry.location.lat(), results[0].geometry.location.lng()), point: [Number(bhage.breddegrad), Number(bhage.lengdegrad)] });
            });

            distances.sort(function (a, b) {
                var sortStatus = 0;

                if (a.distance < b.distance) {
                    sortStatus = -1;
                } else if (a.distance > b.distance) {
                    sortStatus = 1;
                }

                return sortStatus;
            });

            for (var j = 0; j < top; j++) {
                console.log(distances[j].name);
                getDuration(home, work, distances[j], testfunc);
            }

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });



}


function handleResponse(response, status, kindergarten) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
    } else {

        var originList = response.originAddresses;

        for (var i = 0; i < originList.length; i++) {

            var results = response.rows[i].elements;

            var totaltime = 0;
            for (var j = 0; j < results.length; j++) {

                console.log(results[j].duration.text);

                totaltime += Number(results[j].duration.value);
            }

            console.log(totaltime / 60);
            testfunc({ name: kindergarten.name, duration: totaltime });
        }

    }
}


function getDuration(home, work, kindergarten) {
    var baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    var apiKey = 'AIzaSyAFOWIKWyyoxvPHDYpE7ah_tN_sJUs2qVU';

    var service = new google.maps.DistanceMatrixService;

    service.getDistanceMatrix({
        //origins: [{ lat: home[0], lng: home[1] }],
        origins: [home],
        //destinations: [{ lat: kindergarten.point[0], lng: kindergarten.point[1] }, { lat: work[0], lng: work[1] }],
        destinations: [{ lat: kindergarten.point[0], lng: kindergarten.point[1] }, work],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) { handleResponse(response, status, kindergarten) });

}

var findGarten = function () {
    durations = [];
    $.getJSON('data/barnehager.json', findClosest);

    //for (var j = 0; j < 3; j++)
    //{
    //    var resultsDiv = document.getElementById('results'+j);
    //    resultsDiv.innerHTML = '';
    //    resultsDiv.innerHTML += 'YO';
    //}


    //var url = String.format("{0}?origins={1}&destinations={2}&key={3}&callback=?", baseUrl, origin, dest, apiKey);

    //$.ajax({
    //    url: url,
    //    dataType: 'JSONP',
    //    jsonpCallback: 'callback',
    //    type: 'GET',
    //    success: function (data) {
    //        var test = 0;
    //    }
    //});

}

//Element

var homeField = document.getElementsByTagName('input')[0];
var workField = document.getElementsByTagName('input')[1];

//leaflet

//Google
var homeAC, workAC;
function initAutocomplete() {
    workAC = new google.maps.places.Autocomplete(/** @type {!HTMLInputElement} */(workField), { types: ['geocode'] });
    homeAC = new google.maps.places.Autocomplete( /** @type {!HTMLInputElement} */(homeField), { types: ['geocode'] });

    homeAC.addListener('place_changed', chosenHomeAddress);
    google.maps.event.addListener(workAC, 'place_changed', chosenWorkAddress);
}

function chosenHomeAddress() {
    var place = homeAC.getPlace();
    var coords = [
        place.geometry.location.lat(),
        place.geometry.location.lng()
    ];
    //center the map to this place
    centerMap2Place(map);

    //place home marker on map
    homeMarker.setLatLng(coords);
    homeMarker.update();

}

function chosenWorkAddress() {
    var place = workAC.getPlace();
    var coords = [
        place.geometry.location.lat(),
        place.geometry.location.lng()
    ];
    
    //place work marker on map
    workMarker.setLatLng(coords);
    workMarker.update();
    
    //center the map to to both home and work
 /*   var workCoords = workMarker.getLatLng();
    
    var centerBounds = [];
    if (workCoords.lat > 0){//check if work field has been set
        centerBounds.push([workCoords.lat, workCoords.lng]);
    }
    centerBounds.push(coords);
    map.fitBounds(centerBounds);*/
    centerMap2Place(map);

}

function centerMap2Place(map) {
    
    //center the map to to both home and work
    var workCoords = workMarker.getLatLng();
    var homeCoords = homeMarker.getLatLng();
    
    var centerBounds = [];
    if (workCoords.lat > 0){//check if work field has been set
        centerBounds.push([workCoords.lat, workCoords.lng]);
    }
    
    if (homeCoords.lat > 0){//check if home field has been set
        centerBounds.push([homeCoords.lat, homeCoords.lng]);
    }
    
    if (centerBounds.length > 0){
            map.fitBounds(centerBounds, {
                padding: [100, 100]
            });
    }
    
   /* map.setView(coords, 15, {
        animate: true
    });*/
}

function showPlaceIcon(coords, icon, map) {
    L.marker(coords, { icon: icon }).addTo(map);
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });

            homeAC.setBounds(circle.getBounds());
            workAC.setBounds(circle.getBounds());
        });
    }
}



