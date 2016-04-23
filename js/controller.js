var Controller = (function () {
    'use strict';

    //events

    constructor();
    function constructor() {

        //listen for init event
        Map.onInit.addListener(function (err) {
            Views.setUpAutoComplete();

            Views.homeAC.addListener('place_changed', chosenHomeAddress);
            google.maps.event.addListener(Views.workAC, 'place_changed', chosenWorkAddress);
        });

        //views
        Views.onFindKinderGarten.addListener(function (err, data) {
            Utils.findGarten();
        });
    }

    function chosenHomeAddress() {
        var place = Views.homeAC.getPlace();
        var coords = [
            place.geometry.location.lat(),
            place.geometry.location.lng()
        ];

        //place home marker on map
        Map.homeMarker.setLatLng(coords)
            .setOpacity(1)
            .update();

        //center the map to this place
        centerMap2Place();
    }

    function chosenWorkAddress() {
        var place = Views.workAC.getPlace();
        var coords = [
            place.geometry.location.lat(),
            place.geometry.location.lng()
        ];

        //place work marker on map
        Map.workMarker.setLatLng(coords)
            .setOpacity(1)
            .update();;

        //center the map to to both home and work
        centerMap2Place();
    }

    function centerMap2Place() {

        //center the map to to both home and work
        var workCoords = Map.workMarker.getLatLng();
        var homeCoords = Map.homeMarker.getLatLng();

        var centerBounds = [];
        if (workCoords.lat > 0) {//check if work field has been set
            centerBounds.push([workCoords.lat, workCoords.lng]);
        }

        if (homeCoords.lat > 0) {//check if home field has been set
            centerBounds.push([homeCoords.lat, homeCoords.lng]);
        }

        if (centerBounds.length > 0) {
            Map.instance.fitBounds(centerBounds, {
                padding: [100, 100]
            });
        }

        /* Map.instance.setView(coords, 15, {
             animate: true
         });*/
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

                Views.homeAC.setBounds(circle.getBounds());
                Views.workAC.setBounds(circle.getBounds());
            });
        }
    }

    function geoMe(target) {

        //fra https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                Views.setGeoLocation(target, pos);
            }, function () {

                //handleLocationError(true, infoWindow, map.getCenter());

            });
        } else {
            // Browser doesn't support Geolocation
            //handleLocationError(false, infoWindow, Map.instance.getCenter());
        }
    }

    return {
        geolocate: geolocate,
        geoMe: geoMe
    }

})();