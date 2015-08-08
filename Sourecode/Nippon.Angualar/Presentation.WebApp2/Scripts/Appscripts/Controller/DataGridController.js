angular.module('indexApp')
.controller('dataGridCtrl', dataGridsCtrl)
function dataGridsCtrl(DTOptionsBuilder, DTColumnDefBuilder, $scope, coreService) {
    //  console.log('$scope--------------------------------', $scope, gridService);
    var vm = this;
    vm.gridData = [];

    vm.dtOptions = DTOptionsBuilder.newOptions()
         .withOption("paging", true)
         .withOption("pagingType", 'simple_numbers')
         .withOption("pageLength", 9)
         .withOption("searching", true)
    //  .withLanguageSource('Scripts/plugins/datatables/LanguageSource.json');

    //vm.dtColumnDefs = [
    //   DTColumnDefBuilder.newColumnDef(0).notVisible(),
    //   DTColumnDefBuilder.newColumnDef(1).notVisible(),
    //   DTColumnDefBuilder.newColumnDef(2).notSortable()
    //];
    vm.init = function (gridInfo, rootScope) {
        vm.gridInfo = gridInfo;
        vm.rootScope = rootScope;
        coreService.getList($scope.gridInfo.sysViewID, function (data) {
            vm.gridInfo.data = data[1];
            $scope.$apply();

        });

    }
    vm.setData = function (item) {
        var row = angular.copy(item);
        if (angular.isFunction(vm.rootScope.setData)) {
            vm.rootScope.setData(row);
        }
    }
    vm.dtInstanceCallback = function (dtInstance) {
        var datatableObj = dtInstance.DataTable;
        $scope.gridInfo.tableInstance = datatableObj;
    };
    $scope.searchTable = function () {
        var query = $scope.searchQuery;

        $scope.gridInfo.tableInstance.search(query).draw();
    };
}
