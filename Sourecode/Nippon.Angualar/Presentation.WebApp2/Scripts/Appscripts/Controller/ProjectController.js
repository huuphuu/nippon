angular.module('indexApp')
.controller('ProjectCtrl', function ($scope,$timeout, coreService, alertFactory, dialogs) {
    $scope.gridInfo = {
        gridID: 'projecttgrid',
        table: null,
        cols: [
              { name: 'ID', heading: 'ID', width: '0', isHidden: true },
              { name: 'ZOrder', heading: '#', width: '10px' },
              { name: 'Status', heading: 'Status', width: '100px' },
              { name: 'Agent', heading: 'Agent', width: '100px' },
              { name: 'Address', heading: 'Address', width: '200px' },
              { name: 'Market', heading: 'Market', width: '100px' },
			  { name: 'Phone', heading: 'Phone', width: '100px', isHidden: true },
			  { name: 'PIC', heading: 'PIC', width: '100px', isHidden: true },
			  { name: 'TurnOver', heading: 'TurnOver', width: '100px', isHidden: true },
			  { name: 'Bussiness Volumn', heading: 'Bussiness Volumn', width: '100px', isHidden: true }
        ],
        showColMin: 6,
        data: [],
        sysViewID: 1,
        searchQuery: '',
    },
    $scope.statusOptions = statusOptions;
    $scope.layout = {
        enableClear: false,
        enableButtonOrther: false,
        isFull: false
    }
    $scope.setFullSreen = function () {
        var $grid = $scope.gridInfo;
        var table = $grid.tableInstance;
       

        for (var i = $grid.showColMin ; i < $grid.cols.length ; i++) {
            $grid.cols[i].isHidden = $scope.layout.isFull;
            console.log( $grid.cols[i].name)
        }


      
        $scope.layout.isFull = !$scope.layout.isFull;
    }

    $scope.dataSeleted = { ID: 0, Name: "", Code: '', Description: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
    $scope.init = function () {

    }
    $scope.setData = function (data) {
        if (typeof data != 'undefined') {
            $scope.dataSeleted = data;
            $scope.layout.enableClear = true;
            $scope.layout.enableButtonOrther = true;
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
            enableButtonOrther: false
        }
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



})