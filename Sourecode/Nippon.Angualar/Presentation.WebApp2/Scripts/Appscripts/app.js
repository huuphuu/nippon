﻿'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ngSanitize','ui.router', 'angularFileUpload', 'ngCookies', 'ngResource', 'angularGrid', 'app.service', 'datatables', 'ui.bootstrap', 'dialogs.main', 'ui.select']);

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
         .state('position', {
             url: '/position',
             templateUrl: '/Templates/view/position/position-index.html'
         })
        .state('area', {
            url: '/area',
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

