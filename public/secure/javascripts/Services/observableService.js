app.factory('observableService', function ($http) {

    var observableService = {};

    var subject = new Rx.Subject();

    observableService.subject = function () {
        return subject;
    }

    return observableService;
})