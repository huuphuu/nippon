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
        console.log(data)
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
        var maxDate = $filter('getMaxDate')(data[0].IntendEndDate, data[0].CompleteDate);
        var totalDate = $filter('dateDiff')(minDate, maxDate);
        data[0].space = 0;
        data[0].group1 = { isIntersection: false, width: 10 };
        data[0].group2 = { isIntersection: true, width: 75 };
        data[0].group3 = { isIntersection: false, width: 15 };
        data[0].width = 100;

        for (var i = 1; i < data.length; i++) {
      //  for (var i = 1; i < 4; i++) {
                 angular.extend(data[i], getStepInfo(data[i], minDate, maxDate, totalDate));
        }
        console.log(data)
        $scope.data = data;
        $scope.$apply();
        return data;


    }

    function getStepInfo(data, minDate, maxDate, totalDate) {
        var minStartDate = $filter('getMinDate')(data.IntendStartDate, data.StartDate);
        var maxStartDate = $filter('getMaxDate')(data.IntendStartDate, data.StartDate);
        var minEndDate = $filter('getMinDate')(data.IntendEndDate, data.CompleteDate);
        var maxEndDate = $filter('getMaxDate')(data.IntendEndDate, data.CompleteDate);
        var total = $filter('dateDiff')(minStartDate, maxEndDate);
        var width = total * 100 / totalDate;
        var space = $filter('dateDiff')(minDate, minStartDate) * 100 / totalDate;

        var g1Long = $filter('dateDiff')(minStartDate,maxStartDate);
        var g3Long = Math.abs($filter('dateDiff')(minEndDate, maxEndDate));
        var g1 = { long: g1Long, isIntersection: false, width: Math.abs(g1Long) * 100 / total };
        if (data.IntendStartDate > data.StartDate) {/*Overdue*/
            g1.isIntersection = true;
            g1.width = 0;
        }
        var g3 = { long: g3Long, isIntersection: false, width: Math.abs(g3Long) * 100 / total };
        if (data.CompleteDate < data.IntendEndDate) {/*Overdue*/
            g3.isIntersection = true;
            g3.width = 0;
        }

        var isSection = true;
        if (data.IntendEndDate < data.StartDate)
            isSection = false;

        if (g1.width == 0)
            maxStartDate = minStartDate;
        if (g3.width == 0)
            minEndDate = maxEndDate;
        var g2Long = Math.abs($filter('dateDiff')(maxStartDate, minEndDate));
        var g2 = { long: g2Long, isIntersection: isSection, width: Math.abs(g2Long) * 100 / total };
       


        // var group1 = $filter('dateDiff')(dataIntendStartDate, maxEndDate) * 100 / totalDate;
        return {
            space: space,
            longDate: total,
            group1: g1,
            group2: g2,
            group3: g3,
            width: width
        }
    }

    function dateDiff(str1, str2) {
        if (str2 == '')
            str2 = str1;
        return Math.floor((new Date(str2) - new Date(str1)) / 86400000);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel


})