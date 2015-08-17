angular.module('indexApp')
.controller('AreaCtrl', function ($scope, coreService, alertFactory, dialogs) {
    $scope.gridInfo = {
        gridID: 'areagridid',
        table: null,
        cols: [
              { name: 'ID', heading: 'ID', width: '10px',isHidden:true },
               { name: 'Code', heading: 'Tên viết tắt', width: '30%', backColor: true },
              { name: 'Name', heading: 'Tên đầy đủ', width: '50%' },
              { name: 'ManagerEmployeeName', heading: 'Người quản lý', width: '20%' }
        ],
        data: [],
        sysViewID: 2,
        searchQuery: '',
    },
    $scope.parentareas = [];
    $scope.managers = [];
    coreService.getList(8, function (data) {
        $scope.parentareas = data[1];
    });
    coreService.getList(3, function (data) {
        $scope.managers = data[1];
    });
    $scope.statusOptions = statusOptions;
    $scope.layout = {
        enableClear: false,
        enableButtonOrther: false
    }
    $scope.dataSeleted = { ID: 0, Name: "", Code: "", Description: "", ManagerEmployeeID: "0", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
    $scope.init = function () {
        window.setTimeout(function () {
            $(window).trigger("resize")
        }, 200);

        $scope.customSettings = {
            letterCase: 'uppercase'
        };

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