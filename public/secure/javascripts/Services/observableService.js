app.factory('observableService', function ($http, rx) {

    var observableService = {};

    var brokerSequence = Rx.Observable.never();

    observableService.merge = function (observable) {
        brokerSequence = brokerSequence.merge(observable);

        return brokerSequence.throttle(1000);
    }

    return observableService;
})