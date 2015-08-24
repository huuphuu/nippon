angular.module('indexApp')
.controller('baseLineChartCtrl', function ($scope, $modalInstance, data, coreService) {
    $scope.title = 'Timeline Project';
    if (typeof data == 'undefined')
        data = { viewID: 11, ProjectID: 1 };
    $scope.data = [];
    coreService.getViewData({ Sys_ViewID: data.viewID, ProjectID: data.projectID }, function (pData) {
        $scope.data = pData[1];
        $scope.$apply();
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel


})