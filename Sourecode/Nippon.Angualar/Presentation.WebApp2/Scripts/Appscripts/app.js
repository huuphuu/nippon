﻿'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ui.router', 'angularFileUpload', 'ngCookies', 'ngResource']);

//ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/account');

    $stateProvider
      //.state('login', {
      //    url: "",
      //    templateUrl: "/Templates/view/login.html"          
      //})
        .state('account', {
            url: '',
            templateUrl: '/Templates/view/account/index.html'
        })
        .state('employee', {
            url: '/employee',
            templateUrl: '/Templates/view/employee/index.html'
        })
        .state('department', {
            url: '/department',
            templateUrl: '/Templates/view/department/department-index.html'
        })
        .state('office', {
            url: 'department',
            templateUrl: '/Templates/view/office/index.html'
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

