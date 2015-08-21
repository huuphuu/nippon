angular.module('indexApp')
.controller('ProjectCtrl', function ($scope, projectService, coreService, alertFactory, dialogs) {
    $scope.gridInfo = {
        gridID: 'projecttgrid',
        table: null,
        cols: [

            { name: 'ID', heading: '#', width: '8px' },
            { name: 'Status', heading: 'Status', width: '1000px', type: controls.ICON_AND_TEXT, classIcon: 'fa-pencil-square-o' },
            { name: 'AgentName', heading: 'Agent', width: '100px' },
            { name: 'AgentAddress', heading: 'Address', width: '200px' },
            { name: 'ApprovedBy', heading: 'Market', width: '1000px' },
            { name: 'CompetitorName', heading: 'Phone', width: '100px' },
            { name: 'MasterDealerName', heading: 'PIC', width: '100px' },
            { name: 'AttachedPhoto', heading: 'TurnOver', width: '100px' },
            { name: 'NumberOfShopsign', heading: 'Volumn', width: '100px' }
        ],
        showColMin: 6,
        data: [],
        sysViewID: 5,
        searchQuery: '',
        onClick: function (row, col) {
            console.log(row, col)
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
        console.log(data)
        $scope.gridInfo.data = angular.copy(data[1]);

    });

    $scope.steps = [{ title: 'Step 1:  Request', Status: '0', finishDate: '2015-12-03' }, { title: 'Step 2:  Survey ', isOpen: true, Status: '0' }, { title: 'Step 3:  Design', Status: '0' }, { title: 'Step 4:  Approve', Status: '0' }, { title: 'Step 5: Install', Status: '0' }, { title: 'Step 6:  Maketing check', Status: '0' }];
    $scope.loadSteps = function (projectId) {
        coreService.getListEx({ Sys_ViewID: 6, ProjectID: projectId }, function (data) {
            $scope.steps = data[1];
            console.log(data);
        });
    }
    $scope.statusOptions = statusOptions;
    $scope.stepDone = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        return false;
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
            console.log($grid.cols[i].name)
        }



        $scope.layout.isFull = !$scope.layout.isFull;

        window.setTimeout(function () {
            $(window).trigger("resize")
        }, 200);
    }

    $scope.dataSeleted = { ID: 0, Name: "", Code: '', Description: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
    $scope.init = function () {
        window.setTimeout(function () {
            $(window).trigger("resize");
        }, 200);
        //$scope.loadSteps(0);
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
            coreService.actionEntry(entry, function (data) {
                if (data[0].length > 0)
                    if (data[0][0]) {
                        switch (act) {
                            case 'INSERT':
                                entry.ID = data[0][0].ID;
                                $scope.gridInfo.data.unshift(entry);
                                break;
                            case 'UPDATE':
                                angular.forEach($scope.gridInfo.data, function (item, key) {
                                    if (entry.ID == item.ID) {
                                        $scope.gridInfo.data[key] = angular.copy(entry);

                                    }
                                });
                                break;
                            case 'DELETE':
                                var index = -1;
                                var i = 0;
                                angular.forEach($scope.gridInfo.data, function (item, key) {
                                    if (entry.ID == item.ID)
                                        index = i;
                                    i++;
                                });
                                if (index > -1)
                                    $scope.gridInfo.data.splice(index, 1);
                                break;
                        }
                        $scope.reset();
                        dialogs.notify(data[0][0].Name, data[0][0].Description);
                    }
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

    $scope.openDialogChart = function () {
        projectService.dataSelected = $scope.dataSeleted;
        projectService.gridData = $scope.gridInfo.data;
        var dlg = dialogs.create('/templates/view/chart/baseline-index.html', 'baseLineChartCtrl', projectService, { size: 'lg', keyboard: false, backdrop: false });
        dlg.result.then(function (name) {
            $scope.name = name;
        }, function () {
            if (angular.equals($scope.name, ''))
                $scope.name = 'You did not enter in your name!';
        });
    }

})
.controller('projectDialogCtrl', function ($scope, $modalInstance, projectService) {
    //-- Variables --//
    //console.log('projectDialogCtrl', data)
    $scope.dataSelected = projectService.dataSelected;
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
