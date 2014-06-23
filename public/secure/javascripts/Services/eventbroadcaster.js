/* 
    Eventbroadcast service. The first version was By Eric Terpstra, see http://ericterpstra.com/2012/09/angular-cats-part-3-communicating-with-broadcast/.
    This has now been modified according to http://www.theroks.com/angularjs-communication-controllers/.
    */
    app.factory('eventBroadcast', function ($rootScope) {

        var SUBMIT_CALCULATION = "submit_calculation";
        var submitCalculation = function (calculationData) {
            $rootScope.$broadcast(SUBMIT_CALCULATION, calculationData);
        };

        var onSubmitCalculation = function ($scope, handler) {
            $scope.$on(SUBMIT_CALCULATION, function (event, message) {
                handler(message);
            });
        };

        var SEND_NOTIFICATION = 'sendNotification';
        var sendNotification = function (notification) {
            $rootScope.$broadcast(SEND_NOTIFICATION, {
                type: notification.type,
                message: notification.message
            });
        };

        var onNotificationSent = function ($scope, handler) {
            $scope.$on(SEND_NOTIFICATION, function (event, message) {
                handler(message);
            });
        };

        var CLEAR_ALL = 'clearAll';
        var clearAll = function () {
            $rootScope.$broadcast(CLEAR_ALL, { });
        };

        var onClearAll = function ($scope, handler) {
            $scope.$on(CLEAR_ALL, function (event, message) {
                handler(message);
            });
        };

        var EDIT_CALCULATION = 'editCalculation';
        var editCalculation = function (calculation) {
            $rootScope.$broadcast(EDIT_CALCULATION, calculation);
        };

        var onEditCalculation = function ($scope, handler) {
            $scope.$on(EDIT_CALCULATION, function (event, message) {
                handler(message);
            });
        };

        var EMPLOYEE_SELECTION_CHANGED = 'employeeSelectionChanged';
        var employeeSelectionChanged = function (employee) {
            $rootScope.$broadcast(EMPLOYEE_SELECTION_CHANGED, employee);
        };

        var onEmployeeSelectionChanged = function ($scope, handler) {
            $scope.$on(EMPLOYEE_SELECTION_CHANGED, function (event, message) {
                handler(message);
            });
        };

        return {
            submitCalculation: submitCalculation,
            onSubmitCalculation: onSubmitCalculation,
            sendNotification: sendNotification,
            onNotificationSent: onNotificationSent,
            clearAll: clearAll,
            onClearAll: onClearAll,
            onEditCalculation: onEditCalculation,
            editCalculation: editCalculation,
            employeeSelectionChanged: employeeSelectionChanged,
            onEmployeeSelectionChanged: onEmployeeSelectionChanged
        };
    })