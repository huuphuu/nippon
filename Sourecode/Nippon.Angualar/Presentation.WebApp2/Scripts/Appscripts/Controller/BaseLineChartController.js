angular.module('indexApp')
.controller('baseLineChartCtrl', function ($scope, $modalInstance, data, coreService) {
    //-- Variables --//
    //console.log('projectDialogCtrl', data)
    $scope.dataSelected = data.dataSelected;
    $scope.title = 'Timeline Project';
    console.log(data.dataSelected.ID)
    coreService.getViewData({ Sys_ViewID: 11, ProjectID: data.dataSelected.ID }, function (data) {
        console.log(data);

    });

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel


})