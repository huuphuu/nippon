angular.module('indexApp')
 .controller('UserCtrl', function ($scope, $location, alertFactory) {
     $scope.gridInfo = {
         gridID: 'usergrid',
         cols: [
             { name: 'LoginName', heading: 'Login Name', width: '20%', isHidden: false },
             { name: 'FullName', heading: 'Full Name', wdth: '20%', isHidden: false },
             { name: 'LastLogin', heading: 'Last Login', width: '30%', isHidden: false },
             { name: 'Status', heading: 'Status', width: '30%' }
         ],

         data: dataUser
     }
 })