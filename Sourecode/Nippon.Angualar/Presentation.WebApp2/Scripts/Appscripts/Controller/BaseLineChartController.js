angular.module('indexApp')
.controller('baseLineChartCtrl', function ($scope, $modalInstance, data, coreService, $filter) {
    $scope.title = 'Timeline Project';
    if (typeof data == 'undefined')
        data = { viewID: 11, ProjectID: 1 };
    $scope.data = [];

    coreService.getViewData({ Sys_ViewID: data.viewID, ProjectID: data.projectID }, function (pData) {
        modifyData(pData[1])
    });

    function modifyData(data) {
        //console.log(data)
        //
        //debugger;
        //$scope.$apply();

        /*
       CompleteDate: "2015-08-05 00:00:00.000"
       IntendEndDate: "2015-08-05 00:00:00.000"
       IntendStartDate: "2015-08-01 00:00:00.000"
       StartDate: ""
       */
        var minDate = $filter('getMinDate')(data[0].IntendStartDate, data[0].StartDate);
        var maxDate = $filter('getMinDate')(data[0].IntendEndDate, data[0].CompleteDate);
        var totalDate = $filter('dateDiff')(minDate, maxDate);
        $scope.data = data;
        $scope.$apply();
        return data;

       
    }

    function dateDiff(str1, str2) {
        if(str2=='')
            str2=str1;
        return Math.floor((new Date(str2) - new Date(str1)) / 86400000);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel


})