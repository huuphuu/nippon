'use strict';

var app = angular.module('indexApp', ['toaster', 'angularMoment', 'ui.router', 'angularFileUpload', 'ngCookies', 'ngResource']);

//ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/Templates/view/Partials/login.view.html'
        })
        .state('controlPanel', {
            url: '/controlPanel',
            templateUrl: '/Templates/view/CP.index.html',
        })
            .state('controlPanel.uploadFiles', {
                url: '/upload-files',
                templateUrl: '/Templates/view/Partials/upload-files.html'
            })
            .state('controlPanel.listFiles', {
                url: '/list-files',
                templateUrl: '/Templates/view/Partials/list-files.html'
            });
    //if (window.history && window.history.pushState) {
    //    $locationProvider.html5Mode(true);
    //}
});

