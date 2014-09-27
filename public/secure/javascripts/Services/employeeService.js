app.factory('employeeService', function () {
    var selectedEmployees = [];
    var employeeService = {};

    employeeService.selectedEmployees = function () {
        return selectedEmployees;
    };

    employeeService.addSelectedEmployee = function(employee) {
        selectedEmployees.push(employee);

        return selectedEmployees;
    }

    employeeService.removeEmployee = function(employee) {
        angular.forEach(selectedEmployees, function (obj, index) {
            if (obj.name === employee.name) {
                selectedEmployees.splice(index, 1);
            }
        });

        return selectedEmployees;
    }
    
    return employeeService;
})