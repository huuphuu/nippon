﻿angular.module('indexApp')
.controller('baseLineChartCtrl', function ($scope, $modalInstance, data, coreService, $filter) {
    $scope.title = 'Timeline Project';
    if (typeof data == 'undefined')
        data = { viewID: 11, ProjectID: 1 };
    $scope.data = [];

    coreService.getViewData({ Sys_ViewID: data.viewID, ProjectID: data.projectID }, function (pData) {
        modifyData(pData[1])
    });

    function modifyData(data) {
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
        for (var i = 0; i < data.length; i++) {
            if (i == 6)
                angular.extend(data[i], getStepInfo(data[i], minDate, maxDate, totalDate));
        }
        console.log(data)
        $scope.data = data;
        $scope.$apply();
        return data;


    }

    function getStepInfo(data, minDate, maxDate, totalDate) {
        //CompleteDate or CompleteDate === null
        if (data.StartDate == '' || data.CompleteDate == '')
            return {
                group1: { width: 0 },
                group2: { width: 0 },
                group3: { width: 0 }
            }
        var minStartDate = $filter('getMinDate')(data.IntendStartDate, data.StartDate);
        var maxStartDate = $filter('getMaxDate')(data.IntendStartDate, data.StartDate);
        var minEndDate = $filter('getMinDate')(data.IntendEndDate, data.CompleteDate);
        var maxEndDate = $filter('getMaxDate')(data.IntendEndDate, data.CompleteDate);
        var total = $filter('dateDiff')(minStartDate, maxEndDate);
        var width = total * 100 / totalDate;
        var space = $filter('dateDiff')(minDate, minStartDate) * 100 / totalDate;

        var g1 = {}, longG1, widthG1;
        var g2 = {}, longG2, widthG3;
        var g3 = {}, longG3, widthG3;
        //baseline-bar-red baseline-bar-gray baseline-bar-green

        /************Block 1 T1-T2==>G1*****************************************/
        //StartDate =min and enddate< intendStartDate==>ahead of schedule
        if (minStartDate == data.StartDate && data.CompleteDate < data.IntendStartDate) {
            longG1 = $filter('dateDiff')(data.StartDate, data.CompleteDate);
            widthG1 = longG1 == 0 ? 0 : longG1 * 100 / total;
            g1 = {
                css: 'baseline-bar-green',
                long: longG1,
                width: widthG1
            }
        }
        else { //StartDate =min and intendStartDate< intendStartDate==>ahead of schedule
            if (minStartDate == data.StartDate && data.IntendStartDate == maxStartDate) {
                longG1 = $filter('dateDiff')(data.StartDate, maxStartDate);
                widthG1 = longG1 == 0 ? 0 : longG1 * 100 / total;
                g1 = {
                    css: 'baseline-bar-green',
                    long: longG1,
                    width: widthG1
                }
            }
            else {
                //IntendStartDate =min and intendStartDate< intendStartDate==>ahead of schedule
                if (minStartDate == data.IntendStartDate && data.IntendEndDate == maxStartDate) {
                    longG1 = $filter('dateDiff')(data.IntendEndDate, maxStartDate);
                    widthG1 = longG1 == 0 ? 0 : longG1 * 100 / total;
                    g1 = {
                        css: ' ',
                        long: longG1,
                        width: widthG1
                    }
                }
                else {
                    //IntendStartDate =min and intendStartDate< intendStartDate==>ahead of schedule
                    if (minStartDate == data.IntendStartDate && data.StartDate == maxStartDate && data.IntendEndDate >= data.StartDate) {
                        longG1 = $filter('dateDiff')(data.IntendStartDate, maxStartDate);
                        widthG1 = longG1 == 0 ? 0 : longG1 * 100 / total;
                        g1 = {
                            css: 'baseline-bar-red',
                            long: longG1,
                            width: widthG1
                        }
                    }
                    else {
                        //IntendStartDate =min and intendStartDate< intendStartDate==>ahead of schedule
                        longG1 = $filter('dateDiff')(data.IntendStartDate, data.IntendEndDate);
                        widthG1 = longG1 == 0 ? 0 : longG1 * 100 / total;
                        g1 = {
                            css: 'baseline-bar-red',
                            long: longG1,
                            width: widthG1
                        }
                    }
                }
            }

        }

        /************Block 2 T3-T2==>G2*****************************************/
        // IntendStartDate--IntendEndDate
        if (data.IntendStartDate < data.StartDate && data.CompleteDate < data.IntendEndDate) {
            longG2 = $filter('dateDiff')(data.StartDate, data.CompleteDate);
            widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
            g2 = {
                css: 'baseline-bar-gray',
                long: longG2,
                width: widthG2
            }
        }
        else {
            // IntendStartDate--CompletedDate
            if (maxStartDate < data.IntendEndDate && minEndDate < data.CompleteDate) {
                longG2 = $filter('dateDiff')(maxStartDate, minEndDate);
                widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
                g2 = {
                    css: 'baseline-bar-gray',
                    long: longG2,
                    width: widthG2
                }
            }
            else {
                // StartDate--IntendEndDate
                if (maxStartDate == data.StartDate && minEndDate < data.IntendEndDate) {
                    longG2 = $filter('dateDiff')(minEndDate, maxStartDate);
                    widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
                    g2 = {
                        css: 'baseline-bar-gray',
                        long: longG2,
                        width: widthG2
                    }
                }
                else {
                    // StartDate--IntendEndDate
                    if (maxStartDate == data.StartDate && minEndDate < data.CompleteDate) {
                        longG2 = $filter('dateDiff')(minEndDate.maxStartDate);
                        widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
                        g2 = {
                            css: 'baseline-bar-gray',
                            long: longG2,
                            width: widthG2
                        }
                    }
                    else {
                        // IntendStartDate--StartDate
                        if (data.IntendEndDate < data.StartDate) {
                            longG2 = $filter('dateDiff')(data.IntendEndDate, data.StartDate);
                            widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
                            g2 = {
                                css: 'baseline-bar-red',
                                long: longG2,
                                width: widthG2
                            }
                        }
                        else {
                            // IntendStartDate--StartDate
                            if (data.CompleteDate < data.IntendStartDate) {
                                longG2 = $filter('dateDiff')(data.CompleteDate, data.IntendStartDate);
                                widthG2 = longG2 == 0 ? 0 : longG2 * 100 / total;
                                g2 = {
                                    css: 'baseline-bar-red',
                                    long: longG2,
                                    width: widthG2
                                }
                            }
                        }
                    }
                }
            }
        }


        /************Block 3 T3-T4==>G3*****************************************/
        //IntendEndDate<StartDate
        if (data.IntendEndDate < data.StartDate) {
            longG3 = $filter('dateDiff')(data.IntendEndDate, data.CompleteDate);
            widthG3 = longG3 == 0 ? 0 : longG3 * 100 / total;
            g3 = {
                css: 'baseline-bar-red',
                long: longG3,
                width: widthG3
            }
        }
        else { //CompleteDate <IntendStartDate
            if (data.CompleteDate < data.IntendStartDate) {
                longG3 = $filter('dateDiff')(data.CompleteDate, data.IntendEndDate);
                widthG3 = longG3 == 0 ? 0 : longG3 * 100 / total;
                g3 = {
                    css: 'baseline-bar-grren',
                    long: longG3,
                    width: widthG3
                }
            }
            else { //IntendStartDate =min and intendStartDate< intendStartDate==>ahead of schedule
                if (minEndDate == data.CompleteDate && data.IntendEndDate == maxEndDate) {
                    longG3 = $filter('dateDiff')(minEndDate, maxEndDate);
                    widthG3 = longG3 == 0 ? 0 : longG3 * 100 / total;
                    g3 = {
                        css: 'baseline-bar-grren',
                        long: longG3,
                        width: widthG3
                    }
                }
                else {
                    //IntendStartDate =min and intendStartDate< intendStartDate==>ahead of schedule
                    if (minEndDate == data.IntendEndDate && data.CompleteDate == maxEndDate) {
                        longG3 = $filter('dateDiff')(minEndDate, maxEndDate);
                        widthG3 = longG3 == 0 ? 0 : longG3 * 100 / total;
                        g3 = {
                            css: 'baseline-bar-red',
                            long: longG3,
                            width: widthG3
                        }
                    }
                }
            }

        }


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