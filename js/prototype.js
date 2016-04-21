
var map = L.map('map', { minZoom: 12, maxZoom: 18 }).setView([58.96, 5.73], 10);

L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}&format=image/png', {
    attribution: '<a href="http://kartverket.no">Kartverket</a>'
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


