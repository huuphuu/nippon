'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ngSanitize', 'ui.router', 'angularFileUpload', 'ngCookies', 'ngResource', 'angularGrid', 'app.service', 'datatables', 'ui.bootstrap', 'dialogs.main', 'ui.select']);

//ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/nonepermission');

    $stateProvider
             .state('account', {
                 url: '/account',
                 templateUrl: '/Templates/view/account/account-index.html',
                 resolve: {
                     "check": function (accessFac, $location, $route) {   //function to be resolved, accessFac and $location Injected
                      //   console.log($route)
                        // debugger;
                         if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads

                         } else {
                             $location.path('/nonepermission');				//redirect user to home if it does not have permission.
                           }
                     }
                 }
             })
        .state('employee', {
            url: '/employee',
            templateUrl: '/Templates/view/employee/employee-index.html'
        })
        .state('department', {
            url: '/department',
            templateUrl: '/Templates/view/department/department-index.html'
        })
         .state('position', {
             url: '/position',
             templateUrl: '/Templates/view/position/position-index.html'
         })
        .state('area', {
            url: '/area',
            templateUrl: '/Templates/view/office/office-index.html'
        })
        .state('nonepermission', {
            url: '/nonepermission',
            templateUrl: '/Templates/view/nonepermission/nonepermission-index.html'
        })
    

})

var statusOptions = [
        {
            name: 'DeActive',
            value: '1'
        },
{
    name: 'Active',
    value: '0'
}
];

