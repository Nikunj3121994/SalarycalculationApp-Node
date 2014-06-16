var basicdataControllers = angular.module('basicdataControllers', []);

basicdataControllers.controller('basicdataCtrl', ['$scope', '$http', '$filter',
    function ($scope, $http, $filter) {
        var getEmployer = function () {
            $http.get('../api/Employer').success(function (data) {
                $scope.employer = data;

                getEmployees();
            });
        };
        
        $scope.getEmployer = getEmployer;

        getEmployer();

        var getEmployees = function () {
            $http.get('../api/Employee/' + $scope.employer._id).success(function (data) {
                $scope.employer.employees = data;

                if (data.length == 0)
                {
                    $scope.employee = { name: 'fill name', phone: 'fill phone'};
                }
            });
        };

        $scope.showEmployee = function(employeeId) {
            var found = $filter('filter')($scope.employer.employees, {_id: employeeId}, true);
            if (found.length) {
               $scope.employee = found[0];
           } else {
               console.log('not found');
           }
       }

       $scope.submit = function() {
        $http.post('../api/Employer', $scope.employer).success(function(response) {
                    //jei!
                });
    }

    $scope.submitEmployee = function() {

        //If I had sessions support in Node, I could get the employer id from the session (from currently logged in employer).
        if ($scope.employee._employer == undefined){
            $scope.employee._employer = $scope.employer._id;
        }

        $http.post('../api/Employee/', $scope.employee).success(function(response) {
                    //jei!
                });
    }

    $scope.getTaxcard = function (id) {
        $http.get('../api/Taxcard/?' + id).success(function (data) {
            $scope.taxcard = data;
        });
    };
}]);