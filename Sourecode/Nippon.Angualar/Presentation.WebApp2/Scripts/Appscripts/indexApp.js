'use strict';
angular.module('indexApp')
// Controller ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('BodyController', function ($scope, toaster, coreService, accessFac, localStorageService) {
        $scope.navigation = $adminCMS.data.navigation;
        $scope.currentUser = $adminCMS.data.user;
        // $scope.sidebarNavigation = $adminCMS.data.navigation.sidebarNav;
        $scope.sidebarNavigation = [];
        // console.log('$adminCMS.data.navigation.sidebarNav', $adminCMS.data.navigation.sidebarNav)
        var userInfo = accessFac.getUserInfo();
        coreService.userID = userInfo.ID;
        $scope.currentUser.profile.fullName = userInfo.FullName;
        $scope.currentUser.profile.title = userInfo.UserName;
        coreService.getList(10, function (data) {
            var pData = $scope.buildNavigation(data[1]);
            $scope.sidebarNavigation = pData;
            setTimeout(function () {
                $.AdminLTE.tree('.sidebar');
            }, 100);
        });



        $scope.server = $adminCMS.data.server;
        $scope.serverList = $adminCMS.data.serverList;
        $scope.themeButton = 'btn-success';

        $scope.buildNavigation = function (data) {
          
            var tempData = angular.extend([], data),
            masterArr = [],
            childArr = [];
            for (var i = 0; i < tempData.length; i++) {
                tempData[i].name = tempData[i].Name;
                tempData[i].url = tempData[i].Code.toLowerCase();//tempData[i].LinkURL == '' ? '#' : tempData[i].LinkURL;
                tempData[i].cssIcon = tempData[i].CssIcon;
                tempData[i].labelCss = tempData[i].LabelCss;
                if (tempData[i].ParentID == "0") {
                    tempData[i].url = '#';
                    masterArr.push(tempData[i]);
                }
                else {
                    childArr.push(tempData[i]);
                }
            }
            for (var i = 0; i < childArr.length; i++) {
             
                addItemPosition(childArr[i]);
            }
            return masterArr;

            function addItemPosition(item) {
                for (var i = 0; i < masterArr.length; i++) {
                    if (masterArr[i].ID == item.ParentID) {
                        
                        if (typeof masterArr[i].childs == 'undefined')
                            masterArr[i].childs = new Array();
                        masterArr[i].childs.push(item);
                        break;
                    }
                }
            }
        }


        $scope.signOut = function () {
            debugger;
            localStorageService.remove('authorizationData');
            window.location.href = '/index.html';
        }
    })

//Filter ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Directive /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .directive('headerNavbarDropdown', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/Templates/directive/header/nav/header-Navbar-Menu-dropdown.html',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    if ($.AdminLTE.options.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
                        $(".navbar .menu").slimscroll({
                            height: "200px",
                            alwaysVisible: false,
                            size: "3px"
                        }).css("width", "100%");
                    }
                }, 100);
            }
        };
    })
    .directive('headerNavbarMenu', function (localStorageService) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                navigation: '=',
                currentUser: '='
            },
            controller: function ($scope ) {
                $scope.signOut = function () {
                    localStorageService.remove('authorizationData');
                    window.location.href = '/index.html';
                }
            },
            templateUrl: '/Templates/directive/header/nav/header-Navbar-Menu.html'
        };
    })
    .directive('sidebarNavigation', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                navigationSource: '='
            },
            templateUrl: '/Templates/directive/navigation/navigation.html',
            link: function (scope, element, attrs) {
                //setTimeout(function () {
                //    $.AdminLTE.tree('.sidebar');
                //}, 100);
            }
        };
    })
    .directive('navigationMultipleMenu', function ($compile) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                menu: '='
            },
            templateUrl: '/Templates/directive/navigation/navigation-childs.html',
            compile: function (el) {
                var contents = angular.element(el).contents().remove();
                var compiled;
                return function (scope, el) {
                    if (!compiled)
                        compiled = $compile(contents);

                    compiled(scope, function (clone) {
                        el.append(clone);
                    });
                };
            }

        };
    })
    .directive('folderTreeViewParent', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                navigationSource: '=',
                server: "="
            },
            templateUrl: '/Templates/directive/listFolderTreeView/listFolder-Parent.html',
            link: function (scope, element, attrs) {

            }
        };
    })
    .directive('folderTreeViewChilds', function ($compile) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                menu: '='
            },
            templateUrl: '/Templates/directive/listFolderTreeView/listFolder-childs.html',
            compile: function (el) {
                var contents = angular.element(el).contents().remove();
                var compiled;
                return function (scope, el) {
                    if (!compiled)
                        compiled = $compile(contents);

                    compiled(scope, function (clone) {
                        el.append(clone);
                    });
                };
            }

        };
    })
    .directive('contentHeader', function ($timeout) {
        return {
            replace: true,
            templateUrl: '/Templates/directive/form/content-header.html',
            scope: {
                titleName: '@titleName'
            },
        };
    })
    .directive('rightAction', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/Templates/directive/form/right-Action.html',
            controller: function ($scope) {
            }
        };
    })
    .directive('leftAction', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/Templates/directive/form/left-Action.html'
        };
    })
    .directive('gridTable', function ($timeout) {
        return {
            //   restrict: 'EA',
            replace: true,
            templateUrl: '/Templates/directive/grid/angular-data-table-group.html',
            scope: {
                gridInfo: '=',
                rootScope: '='
            },
            controller: function ($scope, gridService) {

            }
        };
    })
    .directive('angularGridTable', function ($timeout) {
        return {
            //   restrict: 'EA',
            replace: true,
            templateUrl: '/Templates/directive/grid/angular-data-table.html',
            scope: {
                gridInfo: '=',
                rootScope: '='
            },
            controller: function ($scope, gridService) {

            }
        };
    })
    .config(['dialogsProvider', '$translateProvider', function (dialogsProvider) {
        dialogsProvider.useBackdrop('static');
        dialogsProvider.useEscClose(false);
        dialogsProvider.useCopy(false);
        dialogsProvider.setSize('sm');


    }])




