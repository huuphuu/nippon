﻿'use strict';

var app = angular.module('indexApp', ['toaster', 'ngSanitize', 'ui.router', 'angularFileUpload','ngAnimate', 'LocalStorageModule', 'ngCookies', 'ngResource', 'angularGrid', 'app.service', 'datatables','datatables.fixedcolumns', 'ui.bootstrap', 'dialogs.main', 'ui.select','minicolors']);

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
            templateUrl: '/Templates/view/department/department-index.html'
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
     .state('test', {
         url: '/test',
         templateUrl: '/Templates/view/chart/baseline-index.html'
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
app.run(function ($templateCache) {
    $templateCache.put('template/chart/popover.html', [
        '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal app-modal" modal-animation-class="fade" ng-class="{in: animate}"',
            'ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">',
            '<div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'">',
                '<div class="modal-content" modal-transclude></div>',
            '</div>',
        '</div>'
    ].join(''));
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

/****CONSTANT*******************/
var controls = {
    BUTTON:'button',
    ICON_AND_TEXT: 'button&text',
    LIST_ICON: 'listicon',
}
