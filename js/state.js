var State = (function () {
    'use strict';

    var home;
    var setHome = function (value) {
        home = value;
    }
    var getHome = function () {
        return home;
    }

    var work;
    var setWork = function (value) {
        work = value;
    }
    var getWork = function () {
        return work;
    }

    var kindergartens;

    var setKindergartens = function (value)
    {
        kindergartens = value;
    }

    var getKindergartens = function() {
        return kindergartens;
    }

    return {
        setKindergartens: setKindergartens,
        getKindergartens: getKindergartens,
        setHome: setHome,
        getHome: getHome,
        setWork: setWork,
        getWork: getWork,
    }

})();