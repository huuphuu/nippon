﻿angular.module('indexApp')
 .controller('UserCtrl', function ($scope, coreService, alertFactory, dialogs) {
     $scope.gridInfo = {
         gridID: 'usergrid',
         table: null,
         cols: [
             { name: 'UserName', heading: 'Login Name', width: '20%', isHidden: false },
             { name: 'EmployeeName', heading: 'Full Name', wdth: '20%', isHidden: false },
             { name: 'StatusName', heading: 'Status', width: '30%' }
         ],

         data: [],
         sysViewID:7,
         searchQuery: '',
     }
     $scope.userlist = [];
     $scope.employeelist = [];
     $scope.roles = [];
     $scope.dataSeleted = { ID: 0, UserName: "", Password: "", EmployeeID: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
     coreService.getList(3, function (data) {
         $scope.employeelist = data[1];
     });
     $scope.loadUserRoles = function (userId) {
         console.log("loadUserRoles");
         coreService.getListEx({ Sys_ViewID: 9, UserID: userId }, function (data) {
             $scope.roles = data[1];
             //console.log("user roles::", data);
         });
     }


    $scope.setData = function (data) {
         if (typeof data != 'undefined') {
             $scope.dataSeleted = data;
             $scope.layout.enableClear = true;
             $scope.layout.enableButtonOrther = true;
             $scope.loadUserRoles(data.ID);
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
             entry.Roles = {};
             entry.Roles.Role = $scope.roles;
             entry.Sys_ViewID = $scope.gridInfo.sysViewID;

             coreService.actionEntry(entry, function (data) {
                 if (data[1].length > 0)
                     if (data[1][0]) {
                         switch (act) {
                             case 'INSERT':
                                 entry.ID = data[1][0].ID;
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
                         dialogs.notify(data[1][0].Name, data[1][0].Description);
                     }
                 $scope.$apply();

             });
         }
     }

     $scope.reset = function (data) {
         $scope.dataSeleted = { ID: 0, UserName: '', Password: '', EmployeeID: "", Status: "0", Sys_ViewID: $scope.gridInfo.sysViewID };
         $scope.layout = {
             enableClear: false,
             enableButtonOrther: false
         }
         $scope.loadUserRoles(0);
         // $scope.$apply();
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