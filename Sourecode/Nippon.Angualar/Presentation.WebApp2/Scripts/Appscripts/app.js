'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ui.router', 'angularFileUpload', 'ngCookies', 'ngResource', 'angularGrid', 'app.service', 'datatables']);

//ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/account');

    $stateProvider
      //.state('login', {
      //    url: "",
      //    templateUrl: "/Templates/view/login.html"          
      //})
        .state('account', {
            url: '/account',
            templateUrl: '/Templates/view/account/account-index.html'
        })
        .state('employee', {
            url: '/employee',
            templateUrl: '/Templates/view/employee/employee-index.html'
        })
        .state('department', {
            url: '/department',
            templateUrl: '/Templates/view/department/department-index.html'
        })
        .state('office', {
            url: '/office',
            templateUrl: '/Templates/view/office/office-index.html'
        })

            .state('uploadFiles', {
                url: '/upload-files',
                templateUrl: '/Templates/view/Partials/upload-files.html'
            })
            .state('listFiles', {
                url: '/list-files',
                templateUrl: '/Templates/view/Partials/list-files.html'
            });
    //if (window.history && window.history.pushState) {
    //    $locationProvider.html5Mode(true);
    //}
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

