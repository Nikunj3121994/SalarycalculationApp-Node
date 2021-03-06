var salaryCalculationControllers = angular.module('salaryCalculationControllers', ['LocalStorageModule'])
.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('sca');
}]);

salaryCalculationControllers.controller('salaryCalculationRootCtrl', ['$scope', '$http', 'localStorageService', 'eventBroadcast', 'uiHelper',
    function ($scope, $http, localStorageService, eventBroadcast, uiHelper) {

        $scope.getFriendlyName = uiHelper.getFriendlyName;

        $scope.submitCalculation = function () {

            eventBroadcast.sendNotification({ type: 'warning', message: 'About to send your calculation to server, do not unplug your machine.' });

            //Broadcast event to ask controllers to give their data.
            var dataToSave = {};
            eventBroadcast.submitCalculation(dataToSave);

            //Save in local storage first.
            localStorageService.clearAll();
            localStorageService.add('submittedSalaryCalculation', dataToSave);

            $http.post('../api/Calculation', dataToSave).success(function (ret) {
                eventBroadcast.sendNotification({ type: 'info', message: 'Your calculation has been succesfully committed to server.' });
                //localStorageService.clearAll();

                eventBroadcast.clearAll();
            }).error(function (ret) {
                eventBroadcast.sendNotification({ type: 'error', message: 'Sending your calculation to the server failed. Don\'t worry, it is saved in your browser and you can try sending it again later.' });
            });

        };

    }]);

salaryCalculationControllers.controller('employeeAndEmployeeGroupController', ['$scope', '$http', 'eventBroadcast', 'observableService', 'employeeService',
    function ($scope, $http, eventBroadcast, observableService, employeeService) {

        $http.get('../api/Employee/').success(function (data) {
            $scope.employees = data;
        });

        $scope.$createObservableFunction('click')
            .map(function () {
                return 'employee was selected/unselected';
            })
            .subscribe(observableService.subject());

        // This was an attempt to get the employees from a service. I will keep this here for later reference. 
        // This was also my first proper look into promise objects.
        
        // employeeService.async().then(function () {
        //    $scope.employees = employeeService.data();
        // });

        eventBroadcast.onEditCalculation($scope, function(calculationToEdit) {

            eventBroadcast.clearAll();

            angular.forEach(calculationToEdit.employees, function (employeeId, index) {
                angular.forEach($scope.employees, function (employee, index) {
                    if (employeeId === employee._id) {
                        $scope.selectEmployee(employee);
                    }
                });
            });
        });

        $scope.selectEmployee = function (employee) {
            if (employee.selected) {
                employee.selected = false;
                employeeService.removeEmployee(employee);
            } else {
                employee.selected = true;
                employeeService.addSelectedEmployee(employee);
            }

            $scope.click();

            eventBroadcast.employeeSelectionChanged(employee);
        };

        // When 'submit' is broadcast, give the selected employees/groups.
        eventBroadcast.onSubmitCalculation($scope, function (calculationData) {
            calculationData.selectedEmployees = new Array();

            for (var i = 0; i < $scope.employees.length; i++) {
                var emp = $scope.employees[i];

                if (emp.selected) {
                    calculationData.selectedEmployees.push(emp);
                }
            }
        });

        eventBroadcast.onClearAll($scope, function () {
            for (var i = 0; i < $scope.employees.length; i++) {
                $scope.employees[i].selected = false;
                employeeService.removeEmployee($scope.employees[i]);
            }
        });

}]);

salaryCalculationControllers.controller('processController', ['$scope', '$http', 'eventBroadcast',
    function ($scope, $http, eventBroadcast) {

        //Start by loading calculations being processed.
        $http.get('../api/Calculation/').success(function (data) {
            $scope.calculationsBeingProcessed = data;
        });

        $scope.canEditCalculation = function(calculation) {
            if (calculation.status == 'submitted') return true;

            return false;
        }

        $scope.canCancelCalculation = function(calculation) {
            return $scope.canEditCalculation(calculation);
        }

        $scope.editCalculation = function(calculation) {
            //We only fetch the calculation rows when they are needed, not any sooner.
            $http.get('../api/CalculationRow/' + calculation._id).success(function (data) {
                calculation.calculationRows = data;

                eventBroadcast.editCalculation(calculation);
                eventBroadcast.sendNotification({ type: 'info', message: 'You are now editing a previously submitted calculation.' });
            });
        }

        $scope.cancelCalculation = function(calculation) {
            $http.post('../api/CalculationCancellation/' + calculation._id).success(function (data) {
                eventBroadcast.sendNotification({ type: 'info', message: 'Your previous calculation has been cancelled.' });
            });
        }

}]);

salaryCalculationControllers.controller('notificationsController', ['$scope', 'eventBroadcast',
    function ($scope, eventBroadcast) {
        $scope.notifications = new Array();

        eventBroadcast.onNotificationSent($scope, function (notification) {
            $scope.notifications[$scope.notifications.length] = notification;
        });
    }]);

salaryCalculationControllers.controller('salaryCalculationController', ['$scope', '$http', 'eventBroadcast', 'uiHelper', 'observableService', 'observeOnScope', 'employeeService',
    function ($scope, $http, eventBroadcast, uiHelper, observableService, observeOnScope, employeeService) {

        $scope.initialize = function () {
            $scope.calculationRows = new Array();

            //TODO: Get these from the uihelper, it loads these too.
            $http.get('../api/CalculationRowType/').success(function (data) {
                $scope.possibleCalculationRowTypes = data;
                $scope.selectedRowType = '';
            });

            $scope.calculationBasicdata = {};

            var currDate = new Date();
            var periodStartDate = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
            var periodEndDate = new Date(new Date(new Date(periodStartDate).setMonth(periodStartDate.getMonth() + 1)) - 1);

            //Set some defaults.
            setCalculationPeriodDates(periodStartDate, periodEndDate);
            $scope.calculationBasicdata.PeriodStartDate = periodStartDate.getDate() + '.' + (periodStartDate.getMonth() + 1) + '.' + periodStartDate.getFullYear();
            $scope.calculationBasicdata.PeriodEndDate = periodEndDate.getDate() + '.' + (periodEndDate.getMonth() + 1) + '.' + periodEndDate.getFullYear();

            $scope.calculationTotals = [];
            $scope.calculationRows = [];
        };

        var setCalculationPeriodDates = function(periodStartDate, periodEndDate){
            if (typeof periodStartDate != Date) periodStartDate = new Date(periodStartDate);
            if (typeof periodEndDate != Date) periodEndDate = new Date(periodEndDate);

            $scope.calculationBasicdata.PeriodStartDate = periodStartDate.getDate() + '.' + (periodStartDate.getMonth() + 1) + '.' + periodStartDate.getFullYear();
            $scope.calculationBasicdata.PeriodEndDate = periodEndDate.getDate() + '.' + (periodEndDate.getMonth() + 1) + '.' + periodEndDate.getFullYear();
        }

        $scope.initialize();

        $scope.addCalculationRow = function () {
            privateAddCalculationRow($scope.selectedRowType, 0);

            $scope.selectedRowType = ''; //Clear this bound field to empty the dropdown again.
        };

        var privateAddCalculationRow = function(rowTypeId, value, employeeId) {
            $scope.calculationRows[$scope.calculationRows.length] = {
                typeId: rowTypeId,
                value: value,
                employeeId: employeeId,
                name: uiHelper.getFriendlyName(rowTypeId, 'calculationRowTypeName'),
                rowType: uiHelper.getFriendlyName(rowTypeId, 'calculationRowType')
            };
        }

        var subscriber = function (data) {
            $scope.calculationTotals = data.data;
        }

        var datachanges = observeOnScope($scope, function($scope)
            { return $scope.calculationRows.
                        map(function(obj) {
                            return obj.value
                        });
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    return newVal;
                }
            }, true)
        .map(function(data) { return 'value changed: ' + data.newValue; });

        var calculationFunction = function(val) {
            return Rx.Observable.fromPromise(
                $http.post('../api/CalculationResult/', 
                    {
                        employees: employeeService.selectedEmployees(),
                        calculationRows: $scope.calculationRows
                    }
                )
            );
        }

        datachanges.subscribe(observableService.subject());

        observableService.subject().throttle(1000).flatMapLatest(calculationFunction).subscribe(subscriber,
            function (err) {
                console.log('Error: ' + err);
            }
        );

        $scope.total = function () {
            var totalNumber = 0;
            for (var i = 0; i < $scope.calculationRows.length; i++) {
                var value = $scope.calculationRows[i].value;
                totalNumber = totalNumber + ($scope.calculationRows[i].rowType === 'plus' ? value : value * -1);
            }

            return totalNumber;
        };

        $scope.totalTax = function (taxPercentage) {
            var total = $scope.total();

            return (taxPercentage / 100) * total;
        };

        eventBroadcast.onSubmitCalculation($scope, function (calculationData) {
            calculationData.basicData = $scope.calculationBasicdata;
            calculationData.calculationRows = $scope.calculationRows;
        });

        eventBroadcast.onEditCalculation($scope, function(calculationToEdit) {
            setCalculationPeriodDates(calculationToEdit.periodStart, calculationToEdit.periodEnd);

            $scope.calculationRows = [];

            angular.forEach(calculationToEdit.calculationRows, function (obj, index) {
                privateAddCalculationRow(obj._calculationRowType, obj.value);
            });
        });

        eventBroadcast.onClearAll($scope, function () {
            $scope.initialize();
        });
    }
    ]);