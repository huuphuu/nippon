angular.module('indexApp')
.service("projectService", function ($http, coreService, dialogs) {
    var projectService = {};
    projectService.Sys_ViewID = 5;
    projectService.dataSelected = { Sys_ViewID: projectService.Sys_ViewID };
    projectService.gridData = [];
    projectService.areaList = [];
    projectService.areaManagerList = [];
    projectService.actionEntry = function(act) {
        if (typeof act != 'undefined') {
            var entry = angular.copy(projectService.dataSelected);
            entry.Action = act;
            entry.Sys_ViewID = projectService.Sys_ViewID;
            console.log("Before save",entry);
            coreService.actionEntry2(entry, function(data) {
                if (data.Success) {
                    switch (act) {
                    case 'INSERT':
                        entry.ID = data.Result;
                        projectService.gridData.unshift(entry);
                        break;
                        case 'UPDATE':
                            console.log("update", projectService.gridData);
                        angular.forEach(projectService.gridData, function(item, key) {
                            if (entry.ID == item.ID) {
                                projectService.gridData[key] = angular.copy(entry);

                            }
                        });
                        console.log("apter update", projectService.gridData);
                        break;

                    case 'DELETE':
                        var index = -1;
                        var i = 0;
                        angular.forEach(projectService.gridData, function(item, key) {
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

            });
        }
    };

    return projectService;
})