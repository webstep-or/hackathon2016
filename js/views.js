/**handles every that has to do with dom manipulation */
var Views = (function () {
    'use strict';

    //events
    var onFindKinderGarten = new EventHandler();

    //private


    var homeField, workField;
    constructor()
    function constructor() {
        homeField = document.getElementsByTagName('input')[0];
        workField = document.getElementsByTagName('input')[1];

        //submit når du trykker enter i work input-group
        document.getElementById("work").addEventListener("keydown", function (e) {
            if (!e) {
                var e = window.event;
            }
            //e.preventDefault(); // sometimes useful
            // Enter is pressed
            if (e.keyCode == 13) {
                onFindKinderGarten.trigger(null);
                //findGarten();
            }
        }, false);
    }


    var homeAC, workAC;

    function setUpAutoComplete() {
        this.workAC = new google.maps.places.Autocomplete(/** @type {!HTMLInputElement} */(workField), { types: ['geocode'] });
        this.homeAC = new google.maps.places.Autocomplete( /** @type {!HTMLInputElement} */(homeField), { types: ['geocode'] });
    }

    /**
     * Adds results from query to the DOM
     */
    function setResults(results) {
        //TODO
    }

    function setGeoLocation(target, pos) {
        if (target == "home") {
            document.getElementById("home").value = pos.lat.toFixed(6) + "," + pos.lng.toFixed(6);
        } else if (target = "work") {
            document.getElementById("work").value = pos.lat.toFixed(6) + "," + pos.lng.toFixed(6);
        }
    }


    return {
        setResults: setResults,
        setUpAutoComplete: setUpAutoComplete,
        homeAC: homeAC,
        workAC: workAC,
        setGeoLocation: setGeoLocation,
        //event
        onFindKinderGarten: onFindKinderGarten
    };



})();