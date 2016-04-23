var onInit = new EventHandler();
/**
   * called by google library after init
   */
function initAutocomplete() {

    //trigger event
    onInit.trigger(null);
}

var Map = (function () {
    'use strict';

    //events


    //private
    var map = L.map('kart', {
        minZoom: 11,
        maxZoom: 18
    }).setView([58.96, 5.73], 10);

    //Set titles 
    L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}&format=image/png', {
        attribution: '<a href="http://kartverket.no">Kartverket</a>'
    }).addTo(map);

    //custom Icons
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

    //custom markers
    var homeMarker = L.marker([0, 0], {
        icon: homeIcon,
        opacity: 0
    });

    var workMarker = L.marker([0, 0], {
        icon: workIcon,
        opacity: 0
    });

    var chosenSchool = L.marker([0, 0], {
        icon: schoolIconWanted,
        opacity: 0
    });

    var wanted = L.layerGroup([homeMarker, chosenSchool, workMarker]);//group the markers

    //cluster the schools
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
        });

        map.addLayer(markers);
        map.addLayer(wanted);

    }

    $.getJSON('data/barnehager.json', addBhageToMap);

    /** 
     * Centers the coordinates in the map
     * @param places is array of coordinates each coordinates is an array of 2 LatLng
     */
    function centerPlacesInMap(places) {
        map.fitBounds(places, {
            padding: [100, 100]
        });
    }

    return {
        instance: map,
        centerPlacesInMap: centerPlacesInMap,
        homeMarker: homeMarker,
        workMarker: workMarker,
        chosenSchool: chosenSchool,
        //events
        onInit: onInit

    }
})();