var Utils = (function () {
    'use strict';

    String.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    }  

    /**
     * Calculates the air distance between 2 coordinates
     * @param lat1 first coordinates latitude
     * @param lon1 first coordinates longitude
     * @param lat2 second coordinates latitude
     * @param lon2 second coordinates longitude
     * 
     * @returns the air distance between 2 coordinates
     */
    function airDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }       

    //var barnehageListeGeo = [];
    /**
     * Finds the closest Kindergartens from a coordinate or address
     * 
     * @schools is a list of kindergartens in Rogaland 
     * 
     * @returns the closest Kindergartens from a coordinate or address
     */
    function findClosestSchools(schools) {

        var top = 5;

        var home = $('#home').val(); //TODO change to an getter from views
        var work = $('#work').val();

        if (home == '' | work == '') {
            return;
        }

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': home
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {


                var distances = [];
                $.each(schools.entries, function (key, bhage) {

                    distances.push({
                        name: bhage.barnehagens_navn,
                        distance: Utils.airDistP2P(bhage.breddegrad, bhage.lengdegrad, results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                        point: [Number(bhage.breddegrad), Number(bhage.lengdegrad)]
                    });
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
                    console.log(distances[j]);
                    //barnehageListeGeo[j] = distances[j].point;
                    //barnehageListeGeo[j] = distances[j];
                    getDuration(home, work, distances[j], testfunc);
                }

                //console.log(barnehageListeGeo);

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    /**
     * get the duration from home to work through a kindergarten
     * @param home is an address or coordinate(LatLng)
     * @param work is an address or coordinate(LatLng)
     * @param kindergarten 
     */
    function getDuration(home, work, kindergarten) {
        var baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
        var apiKey = 'AIzaSyAFOWIKWyyoxvPHDYpE7ah_tN_sJUs2qVU';

        var service = new google.maps.DistanceMatrixService;

        //get distance from google distancematrix
        service.getDistanceMatrix({
            //origins: [{ lat: home[0], lng: home[1] }],
            origins: [home],
            //destinations: [{ lat: kindergarten.point[0], lng: kindergarten.point[1] }, { lat: work[0], lng: work[1] }],
            destinations: [{
                lat: kindergarten.point[0],
                lng: kindergarten.point[1]
            }, work],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
            }
            handleResponse(response, status, kindergarten)
        });

    }

    

    function handleResponse(response, status, kindergarten) {

        //responseLatLng = response;
        var originList = response.originAddresses;

        for (var i = 0; i < originList.length; i++) {

            var results = response.rows[i].elements;

            var totaltime = 0;
            for (var j = 0; j < results.length; j++) {

                console.log(results[j].duration.text);

                totaltime += Number(results[j].duration.value);
            }

            console.log(totaltime / 60);
            testfunc({
                name: kindergarten.name,
                point: kindergarten.point,
                duration: totaltime
            });
        }

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
                resultsDiv.innerHTML = "<a href='#' onclick='Map.centerPlacesInMap([" +  durations[j].point + "])' />  " + (j + 1) + ". " + String.format("{0} {1} min", durations[j].name, new Date(durations[j].duration * 1000).getMinutes()) + "</a>";

            };
        }
    }

    function findGarten() {
        durations = [];
        $.getJSON('data/barnehager.json', findClosestSchools);
        $("#barnehage-resultat").animate({ top: "-249px" });
    }

    return {
        airDistP2P: airDistance,
        findGarten: findGarten,
        //barnehageListeGeo: barnehageListeGeo
    }
})();