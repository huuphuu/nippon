angular.module('indexApp')
.controller('ProjectCtrl', function ($scope, projectService, coreService, authoritiesService, alertFactory, dialogs, $filter) {
    $scope.gridInfo = {
        gridID: 'projecttgrid',
        table: null,
        cols: [

            { name: 'ID', heading: '#', width: '2%' },
            { name: 'DisplayStatus', heading: 'Status', width: '3%', className: 'text-center' },
            { name: 'Action', heading: 'Action', width: '3%', className: 'text-center', type: controls.LIST_ICON, listAction: [{ classIcon: 'fa-pencil-square-o', action: 'view' }, { classIcon: ' fa-bar-chart', action: 'chart' }] },
            { name: 'AgentName', heading: 'Agent', width: '3%' },
            { name: 'AgentAddress', heading: 'Address', width: '3%' },
            { name: 'AgentPhone', heading: 'AgentPhone', width: '3%', className: 'text-center' },
            { name: 'AgentContactName', heading: 'Agent Contact Name', width: '3%' },
           
            { name: 'AreaManagerName', heading: 'ApprovedBy', width: '3%' },
            { name: 'AttachedPhoto', heading: 'AttachedPhoto', width: '3%' },
            { name: 'CompetitorName', heading: 'CompetitorName', width: '3%' },
            { name: 'ComplitionDate', heading: 'ComplitionDate', width: '3%' },
            { name: 'DealerTypeName', heading: 'DealerType', width: '3%' },
            { name: 'EstimatedAnnualTurnover', heading: 'EstimatedAnnualTurnover', width: '3%' },
            { name: 'HadCCMName', heading: 'HadCCM', width: '10%' },
            { name: 'HadCompetitorShopsignName', heading: 'HadCompetitorShopsign', width: '10%' },
            { name: 'IsCCMName', heading: 'IsCCM', width: '10%' },
            { name: 'IsShopsignName', heading: 'IsShopsign', width: '10%' },
            { name: 'MasterDealerName', heading: 'MasterDealerName', width: '10%' },
            { name: 'NumberOfShelf', heading: 'NumberOfShelf', width: '10%' },
            { name: 'NumberOfShopsign', heading: 'NumberOfShopsign', width: '10%' },
            { name: 'RequestedBy', heading: 'RequestedBy', width: '10%' },
            { name: 'ShopsignPlacementName', heading: 'ShopsignPlacement', width: '10%' },
            { name: 'ShopsignSize', heading: 'ShopsignSize', width: '10%' }
        ],
        showColMin: 6,
        data: [],
        sysViewID: 5,
        pageLength:16,
        searchQuery: '',
        onActionClick: function (rowID, act) {
            switch (act) {
                case 'view':
                    $scope.openDialog();
                    break;
                case 'chart':
                    $scope.openDialogChart(rowID);

                    break;


            }
        },
        setData: function (row, col) {
            if (typeof row != 'undefined') {
                $scope.setData(row);
                if (col == 'Status') {
                    $scope.openDialogChart();
                }
            }
        }
    }
    coreService.getList($scope.gridInfo.sysViewID, function (data) {
        $scope.gridInfo.data = angular.copy(data[1]);

    });
    var listRight = authoritiesService.get($scope.gridInfo.sysViewID);
    console.log('listRight', listRight);
    $scope.formDisabled = false;
    $scope.statusOptions = statusOptions;
    $scope.stepDone = function ($event, item) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.setComplete(item);
        //return false;
    },
    $scope.layout = {
        enableClear: false,
        enableButtonOrther: false,
        isFull: false,
        titlePopup: 'Add New Project'
    }
    $scope.setFullSreen = function () {
        var $grid = $scope.gridInfo;
        var table = $grid.tableInstance;
        for (var i = $grid.showColMin ; i < $grid.cols.length ; i++) {
            $grid.cols[i].isHidden = $scope.layout.isFull;
        }

        $scope.layout.isFull = !$scope.layout.isFull;

        window.setTimeout(function () {
            $(window).trigger("resize")
        }, 200);
    }

    //*****************************************
    //  entry data
    //*****************************************
    $scope.steps = [{ StepName: 'Step 1:  Request', Status: '0', finishDate: '2015-12-03' }, { StepName: 'Step 2:  Survey ', isOpen: true, Status: '0' }, { StepName: 'Step 3:  Design', Status: '0' }, { StepName: 'Step 4:  Approve', Status: '0' }, { StepName: 'Step 5: Install', Status: '0' }, { StepName: 'Step 6:  Maketing check', Status: '0' }];
    $scope.employeelist = [];
    $scope.areaList = [];
    $scope.areaManagerList = [];
    $scope.loadSteps = function (projectId) {
        coreService.getListEx({ Sys_ViewID: 6, ProjectID: projectId }, function (data) {
            $scope.steps = converDatetoView(data[1]);
            //console.log(data);
            $scope.$apply();
        });
    }
    coreService.getListEx({ Sys_ViewID: 3 }, function (data) {
        $scope.employeelist = data[1];
        //$scope.$apply();
    });
    //danh sach khu vuc cap 1
    coreService.getListEx({ Sys_ViewID: 8 }, function (data) {
        $scope.areaList = data[1];
        //$scope.$apply();
    });
    coreService.getListEx({ Sys_ViewID: 12 }, function (data) {
        $scope.areaManagerList = data[1];
        //$scope.$apply();
    });
    $scope.dataSeleted = { ID: 0, Name: "", Code: '', Description: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
    $scope.init = function () {
        window.setTimeout(function () {
            $(window).trigger("resize");
        }, 200);
        $scope.loadSteps(0);
    }
    $scope.setData = function (data) {
        if (typeof data != 'undefined') {
            $scope.dataSeleted = data;
            $scope.layout.enableClear = true;
            $scope.layout.enableButtonOrther = true;
            $scope.loadSteps($scope.dataSeleted.ID);
        }
    }
    $scope.actionConfirm = function (act) {
        var dlg = dialogs.confirm('Confirmation', 'Confirmation required');
        dlg.result.then(function (btn) {
            $scope.actionEntry(act);
        }, function (btn) {
            //$scope.confirmed = 'You confirmed "No."';
        });
    }
    $scope.actionEntry = function (act) {
        if (typeof act != 'undefined') {
            var entry = angular.copy($scope.dataSeleted);
            entry.Action = act;
            entry.Sys_ViewID = $scope.gridInfo.sysViewID;
            entry.Steps = {};

            entry.Steps.Step = converDatetoDB();
            coreService.actionEntry2(entry, function (data) {
                if (data.Success) {
                    switch (act) {
                        case 'INSERT':
                            entry.ID = data.Result;
                            projectService.gridData.unshift(entry);
                            break;
                        case 'UPDATE':
                            angular.forEach(projectService.gridData, function (item, key) {
                                if (entry.ID == item.ID) {
                                    projectService.gridData[key] = angular.copy(entry);

                                }
                            });
                            break;
                        case 'DELETE':
                            var index = -1;
                            var i = 0;
                            angular.forEach(projectService.gridData, function (item, key) {
                                if (entry.ID == item.ID)
                                    index = i;
                                i++;
                            });
                            if (index > -1)
                                projectService.gridData.splice(index, 1);
                            break;
                    }
                    //$scope.reset();
                }
                dialogs.notify(data.Message.Name, data.Message.Description);
                $scope.$apply();

            });
        }
    }
    function converDatetoDB(obj) {
        var entry = angular.copy($scope.steps);
        angular.forEach(entry, function (item, key) {
            if (item.IntendStartDate instanceof Date) {
                item.IntendStartDate = $filter('date')(item.IntendStartDate, "yyyy-MM-dd");
            }
            if (item.CompleteDate instanceof Date) {
                item.CompleteDate = $filter('date')(item.CompleteDate, "yyyy-MM-dd");
            }
            if (item.IntendEndDate instanceof Date) {
                item.IntendEndDate = $filter('date')(item.IntendEndDate, "yyyy-MM-dd");
            }
            if (item.StartDate instanceof Date) {
                item.StartDate = $filter('date')(item.StartDate, "yyyy-MM-dd");
            }
        });
        return entry;
    }
    function converDatetoView(entry) {
        angular.forEach(entry, function (item, key) {
            if (item.IntendStartDate != '') {
                item.IntendStartDate = new Date(item.IntendStartDate);
            }
            if (item.CompleteDate != '') {
                item.CompleteDate = new Date(item.CompleteDate);
            }
            if (item.IntendEndDate != '') {
                item.IntendEndDate = new Date(item.IntendEndDate);
            }
            if (item.StartDate != '') {
                item.StartDate = new Date(item.StartDate);
            }
        });
        return entry;
    }
    $scope.setComplete = function (item) {
        if (typeof item != 'undefined') {
            var entry = angular.copy(item);
            entry.Action = "UPDATE::STEPCOMPLETE";
            entry.ProjectID = $scope.dataSeleted.ID;
            entry.Sys_ViewID = $scope.gridInfo.sysViewID;
            coreService.actionEntry2(entry, function (data) {
                if (data.Success) {
                    item.CompleteDate = new Date();
                    item.Status = '1';

                } else {
                    dialogs.notify(data.Message.Name, data.Message.Description);
                }
                //dialogs.notify(data.Message.Name, data.Message.Description);
                $scope.$apply();

            });
        }
    }
    $scope.reset = function (data) {
        $scope.dataSeleted = { ID: 0, Name: '', Code: '', Description: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
        $scope.layout = {
            enableClear: false,
            enableButtonOrther: false,
            isFull: false
        }
        $scope.loadSteps(0);
        // $scope.$apply();
    }



    //********************************************

    $scope.searchTable = function () {
        var query = $scope.gridInfo.searchQuery;
        $scope.gridInfo.tableInstance.search(query).draw();
    };
    $scope.changeText = function () {
        if ($scope.dataSeleted.Name == '' && $scope.dataSeleted.Description == '')
            $scope.layout.enableClear = false;
        else
            $scope.layout.enableClear = true;

        if ($scope.dataSeleted.Name == '')
            $scope.layout.enableButtonOrther = false;
        else
            $scope.layout.enableButtonOrther = true;

        // $scope.$apply();
    }

    $scope.openDialog = function () {
        projectService.areaList = $scope.areaList;
        projectService.areaManagerList = $scope.areaManagerList;
        projectService.dataSelected = $scope.dataSeleted;
        projectService.gridData = $scope.gridInfo.data;
        var dlg = dialogs.create('/templates/view/project/project-popup.html', 'projectDialogCtrl', projectService, { size: 'lg', keyboard: false, backdrop: false });
        dlg.result.then(function (name) {
            $scope.name = name;
        }, function () {
            if (angular.equals($scope.name, ''))
                $scope.name = 'You did not enter in your name!';
        });
    }

    $scope.openDialogChart = function (pID) {
        var data = { viewID: 11, projectID: pID }
        var dlg = dialogs.create('/templates/view/chart/baseline-index.html', 'baseLineChartCtrl', data, { size: 'lg', keyboard: false, backdrop: false });
        dlg.result.then(function (name) {
            $scope.name = name;
        }, function () {
            if (angular.equals($scope.name, ''))
                $scope.name = 'You did not enter in your name!';
        });
    }
   //   $scope.openDialogChart(1);
})
.controller('projectDialogCtrl', function ($scope, $modalInstance, projectService) {
    //-- Variables --//
    //console.log('projectDialogCtrl', data)
    $scope.dataSelected = projectService.dataSelected;
    $scope.areaList = projectService.areaList;
    $scope.areaManagerList = projectService.areaManagerList;
    //console.log("init:data", $scope.dataSelected);
    //console.log("init:data", projectService.dataSelected);
    $scope.user = { name: '' };
    //$scope.title = data.layout.titlePopup;
    //-- Methods --//

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel

    $scope.save = function () {
        var act = "INSERT";
        //console.log("save:data", $scope.dataSelected);
        //console.log("save:projectService", projectService.dataSelected);
        if ($scope.dataSelected.ID != undefined && $scope.dataSelected.ID > 0) act = "UPDATE";
        projectService.actionEntry(act);
        $modalInstance.close($scope.user.name);
    }; // end save

    $scope.hitEnter = function (evt) {
        //if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.user.name, null) || angular.equals($scope.user.name, '')))
        //    $scope.save();
    };
}) // end controller(customDialogCtrl)

.directive('projectStep', function ($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '/Templates/view/project/project-Step.html',
        controller: function ($scope) {
            $scope.today = function () {
                $scope.dt1 = new Date();
                $scope.dt2 = new Date();
                $scope.dt3 = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt1 = null;
            };

            $scope.formats = ['shortDate', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
            $scope.format = $scope.formats[1];

            $scope.status = {
                openedD1: false,
                openedD2: false,
                openedD3: false
            };

        }
    };
})
