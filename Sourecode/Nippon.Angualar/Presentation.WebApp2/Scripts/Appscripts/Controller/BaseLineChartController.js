angular.module('indexApp')
.controller('baseLineChartCtrl', function ($scope, $modalInstance, projectService) {
    //-- Variables --//
    //console.log('projectDialogCtrl', data)
    $scope.dataSelected = projectService.dataSelected;
    //console.log("init:data", $scope.dataSelected);
    //console.log("init:data", projectService.dataSelected);
    $scope.title = 'Timeline Project';
    //$scope.title = data.layout.titlePopup;
    //-- Methods --//

    $scope.cancel = function () {
        $modalInstance.dismiss('Canceled');
    }; // end cancel


})