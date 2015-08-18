angular.module('indexApp')
.service("ProjectService", function ($http, coreService) {
    var projectService = {};
    projectService.Sys_ViewID = 7;
    projectService.dataSeleted = { Sys_ViewID: Sys_ViewID };
    projectService.actionEntry = function (act) {
        if (typeof act != 'undefined') {
            var entry = angular.copy(projectService.dataSeleted);
            entry.Action = act;
            entry.Sys_ViewID = projectService.Sys_ViewID;
            coreService.actionEntry(entry, function (data) {
                if (data[0].length > 1)
                    if (data[1][0]) {
                        switch (act) {
                            case 'INSERT':
                                entry.ID = data[1][0].Result;
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
    return projectService;
})