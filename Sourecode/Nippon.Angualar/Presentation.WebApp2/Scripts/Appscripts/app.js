'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ngSanitize', 'ui.router', 'angularFileUpload', 'LocalStorageModule', 'ngCookies', 'ngResource', 'angularGrid', 'app.service', 'datatables', 'ui.bootstrap', 'dialogs.main', 'ui.select','minicolors']);

//ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/project');

    $stateProvider
             .state('account', {
                 url: '/account',
                 templateUrl: '/Templates/view/account/account-index.html'
                 //,resolve: {
                 //    "check": function (accessFac, $location) {   //, $route, localStorageService function to be resolved, accessFac and $location Injected
                 //        if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
                 //            // return true;
                 //        } else {
                 //            window.location.href = '/index.html';			//redirect user to home if it does not have permission.
                 //        }
                 //    }
                 //}
             })
        .state('employee', {
            url: '/employee',
            templateUrl: '/Templates/view/employee/employee-index.html'
        })
        .state('department', {
            url: '/department',
            templateUrl: ''
        })
         .state('position', {
             url: '/position',
             templateUrl: '/Templates/view/position/position-index.html'
         })
        .state('area', {
            url: '/area',
            templateUrl: '/Templates/view/area/area-index.html'
        })
        .state('nonepermission', {
            url: '/nonepermission',
            templateUrl: '/Templates/view/nonepermission/nonepermission-index.html'
        })
         .state('project', {
             url: '/project',
             templateUrl: '/Templates/view/project/project-index.html'
         })

})

app.run(function ($rootScope, $location, accessFac) {
    // Register listener to watch route changes. 
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        
        if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
            // return true;
        } else {
            window.location.href = '/index.html';			//redirect user to home if it does not have permission.
        }

    });


});

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

