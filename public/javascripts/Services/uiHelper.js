app.factory('uiHelper', function ($http) {

    var rowTypes = [];

    $http.get('../api/CalculationRowType/').success(function (data) {
        rowTypes = data;
    });

    this.getFriendlyName = function (friendlyfyThis, type) {

        switch (type) {
            case 'status':
            switch (friendlyfyThis) {
                case 'GeneratingReports':
                return 'Generating reports';
                case 'AwaitingApproval':
                return 'Awaiting approval';
                case 'submitted':
                return "Submitted";
                default:
                return "Unknown status";
            }
            break;
            case 'calculationRowTypeName': {
                for (var i = rowTypes.length - 1; i >= 0; i--) {
                    if (rowTypes[i]._id == friendlyfyThis) {
                        return rowTypes[i].friendlynames[0].friendlyName;
                    }
                };
                return 'not found';
            }
            case 'calculationRowType':
            {
                for (var i = rowTypes.length - 1; i >= 0; i--) {
                    if (rowTypes[i]._id == friendlyfyThis) {
                        return rowTypes[i].rowType;
                    }
                };
            }
        }
    }

    window.uiHelper = this;

    return this;
});