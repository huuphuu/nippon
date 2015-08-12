angular.module('indexApp')
.controller('dataGridCtrl', dataGridsCtrl)
function dataGridsCtrl(DTOptionsBuilder, DTColumnDefBuilder, DTColumnDefBuilder, $scope, coreService) {
    //  console.log('$scope--------------------------------', $scope, gridService);
    var vm = this;
    vm.gridData = [];

    vm.dtOptions = DTOptionsBuilder.newOptions()
         .withOption("paging", true)
         .withOption("pagingType", 'simple_numbers')
         .withOption("pageLength", 9)
         .withOption("searching", true)
        .withOption("autowidth", false)
    //  .withLanguageSource('Scripts/plugins/datatables/LanguageSource.json');


    vm.init = function (gridInfo, rootScope) {
        vm.gridInfo = gridInfo;
        vm.rootScope = rootScope;
        coreService.getList($scope.gridInfo.sysViewID, function (data) {
            vm.gridInfo.data = data[1];
            $scope.$apply();

        });

        //angular.forEach(data, function (value, key) {
        //    if (typeof value != "function" && typeof value != "object") {
        //        // value = html.decode(value);
        //        inputs.push($.string.Format('{0}="{1}" ', key, objThis.html.encode(value)));
        //    }
        //});

        vm.dtColumnDefs = [
     //   DTColumnDefBuilder.newColumnDef(1).notSortable(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
    }
    vm.setData = function (item, col) {
        var row = angular.copy(item);
        if (angular.isFunction(vm.rootScope.setData)) {
            vm.rootScope.setData(row, col);
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
