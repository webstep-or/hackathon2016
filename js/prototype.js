var map = L.map('map').setView([60, 8], 7);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var geocodingAPI = "http://hotell.difi.no/api/json/stavanger/barnehager?";

var geocodingAPI2 = "http://hotell.difi.no/api/json/stavanger/barnehager?page=2";

var addBhageToMap = function (json) {

    var markers = L.markerClusterGroup();

    $.each(json.entries, function (key, bhage) {

        var title = bhage.barnehagens_navn;

        var marker = L.marker([bhage.breddegrad, bhage.lengdegrad], {
            title: title
        });
        marker.bindPopup(title);

        markers.addLayer(marker);

        //L.marker([bhage.breddegrad, bhage.lengdegrad]).addTo(map);

        console.log(key + ": " + bhage);
    });

    map.addLayer(markers);

}

$.getJSON(geocodingAPI, addBhageToMap);
$.getJSON(geocodingAPI2, addBhageToMap);


