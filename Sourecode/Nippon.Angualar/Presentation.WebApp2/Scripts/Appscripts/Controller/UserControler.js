angular.module('indexApp')
 .controller('UserCtrl', function ($scope, $location, alertFactory) {
     $scope.gridInfo = {
         gridID: 'usergrid',
         table: null,
         cols: [
             { name: 'LoginName', heading: 'Login Name', width: '20%', isHidden: false },
             { name: 'FullName', heading: 'Full Name', wdth: '20%', isHidden: false },
             { name: 'LastLogin', heading: 'Last Login', width: '30%', isHidden: false },
             { name: 'Status', heading: 'Status', width: '30%' }
         ],

         data: [],
         sysViewID:7,
         searchQuery: '',
     }
     $scope.layout = {
         enableClear: false,
         enableButtonOrther: false
     }
    
     $scope.init = function () {
         window.setTimeout(function () {
             $(window).trigger("resize")
         }, 200);
     }
 })