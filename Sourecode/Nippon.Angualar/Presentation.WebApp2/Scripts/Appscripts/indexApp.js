﻿'use strict';
angular.module('indexApp')
// Controller ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('BodyController', function ($scope, toaster, coreService, accessFac, localStorageService, authoritiesService, dialogs) {
        $scope.navigation = $adminCMS.data.navigation;
        $scope.currentUser = $adminCMS.data.user;
        $scope.skin = layoutConfig.skin;
        // $scope.sidebarNavigation = $adminCMS.data.navigation.sidebarNav;
        $scope.sidebarNavigation = [];
        // console.log('$adminCMS.data.navigation.sidebarNav', $adminCMS.data.navigation.sidebarNav)
        var userInfo = accessFac.getUserInfo();
        coreService.userID = userInfo.ID;
        $scope.currentUser.profile.fullName = userInfo.FullName;
        $scope.currentUser.profile.title = userInfo.UserName;
        $scope.metroNavigation = [];
        coreService.getList(10, function (data) {
            var pData = $scope.buildNavigation(data[1]);
            authoritiesService.set(data[1]);
            $scope.metroNavigation = data[1];
            $scope.sidebarNavigation = pData;
            setTimeout(function () {
                $.AdminLTE.tree('.sidebar');
                $(window).trigger("resize");
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

    })

    .controller('changePasswordDialogCtrl', function ($scope, $modalInstance, data) {
        $scope.title = data.title;
        $scope.enableChange = true;
        $scope.ConfirmNewPassword = '';
        $scope.CurrentPassword = '';
        $scope.NewPassword = '';
        $scope.execAction = data.execAction;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel
        $scope.checkDisabled = function () {
            $scope.enableChange = false;
            if ($scope.NewPassword == '' || $scope.ConfirmNewPassword == '' || $scope.CurrentPassword == '' || ($scope.ConfirmNewPassword != $scope.NewPassword) || $scope.NewPassword.length < 1)
                $scope.enableChange = true;


        }; // 
        $scope.Change = function () {
            $scope.execAction({ OldPassword: $scope.CurrentPassword, NewPassword: $scope.NewPassword, Sys_ViewID: 7, Action: 'UPDATE::CHANGEPASS' }, function () { alert('qq'); $modalInstance.dismiss('Canceled'); });
        }; // end save

        $scope.hitEnter = function (evt) {
            //if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.user.name, null) || angular.equals($scope.user.name, '')))
            //    $scope.save();
        };

        $scope.IsRequestObject = function (object) {
            return ($scope.dataSelected.RequestObjects & object == object) ? true : false;
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
    .directive('headerNavbarMenu', function (localStorageService, dialogs, coreService, authoritiesService, alertFactory) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                navigation: '=',
                currentUser: '='
            },
            controller: function ($scope, md5) {
                $scope.signOut = function () {
                    localStorageService.remove('authorizationData');
                    window.location.href = '/index.html';
                }
                $scope.changePassword = function () {
                    $scope.dlgChangePassword = dialogs.create('/templates/directive/form/changepassword.html', 'changePasswordDialogCtrl', { title: 'Change Password', execAction: $scope.actionConfirm }, { size: 'lg', keyboard: false, backdrop: true });
                    $scope.dlgChangePassword.result.then(function (name) {
                        $scope.name = name;
                    }, function () {
                        if (angular.equals($scope.name, ''))
                            $scope.name = 'You did not enter in your name!';
                    });
                }
                $scope.actionConfirm = function (entry, callback) {
                    entry.UserID = coreService.userID;
                    entry.OldPassword = md5.createHash(entry.OldPassword || '');
                    entry.NewPassword = md5.createHash(entry.NewPassword || '');
                    var dlg = dialogs.confirm('Confirmation', 'Confirmation required');
                    dlg.result.then(function (btn) {
                        coreService.actionEntry2(entry, function (data) {
                            dialogs.notify(data.Message.Name, data.Message.Description, function () {

                            });

                            if (data.Success) {
                                $scope.dlgChangePassword.close();
                            }

                            $scope.$apply();
                        });
                    }, function (btn) {
                        //$scope.confirmed = 'You confirmed "No."';
                    });
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
.directive('vmisTable', function (coreService) {
    return {
        // restrict: "AE",
        templateUrl: function (elem, attrs) {
            return attrs["templateUrl"] || 'Templates/directive/grid/vmis-Table.html';
        },
        scope: {
            gridInfo: '=vmisTable'
        },
        controller: function ($scope, $element, $attrs, $q, DTOptionsBuilder, DTColumnBuilder, $timeout, $compile) {
            var pageLength = 20;
            if (typeof $scope.gridInfo.pageLength != 'undefined')
                pageLength = $scope.gridInfo.pageLength
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                                .withOption("paging", true)
                                .withOption("pagingType", 'simple_numbers')
                                .withOption("pageLength", pageLength)
                                .withOption("searching", true)
                               .withOption("autowidth", false)
                               .withOption('responsive', true)
                                .withOption('scrollX', '30%')
                               .withOption('scrollCollapse', true)
                                .withOption('createdRow', createdRow)
                                .withFixedColumns({
                                    leftColumns: 3,
                                    rightColumns: 0
                                })
                               .withOption('rowCallback', rowCallback);

            function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function ($event) {
                    var col = $(this).attr('class').split(' ')[0];
                    // aData.gridPositoin = $scope.gridInfo.tableInstance.fnGetPosition(this);

                    var row = $(this).closest('tr');
                    $scope.gridInfo.nRow = row[0];
                    $("tr").removeClass('selected');
                    $(this).parent().addClass('selected');
                    $scope.gridInfo.setData(aData, col);
                    $event.preventDefault();
                    $event.stopPropagation();
                });
                return nRow;
            }

            function createdRow(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            }


            $scope.dtColumns = standardFields($scope.gridInfo.cols);
            $scope.dtInstance = {}

            $scope.searchTable = function () {
                var query = $scope.searchQuery;
                $scope.gridInfo.tableInstance.search(query).draw();
            };
            $scope.deleteRow = function () {
                //debugger;
                $scope.dtInstance.DataTable.rows('.selected').remove().draw(false);
                $scope.dtInstance.dataTable.fnDeleteRow($scope.gridInfo.nRow, null, false);
            }
            $scope.addRow = function (entry) {
                $scope.dtInstance.dataTable.fnAddData(entry);
            }
            $scope.updateRow = function (aData) {
                loadData();
                // $scope.dtInstance.dataTable.fnUpdate(aData, $scope.gridInfo.nRow);
            }
            $scope.gridInfo.CustomSearch = function (newValue) {
                if (typeof newValue != 'undefined')
                    if (typeof newValue.Sys_ViewID != 'undefined') {
                        coreService.getListEx(newValue, function (data) {
                            $scope.gridInfo.data = angular.copy(data[1]);
                            $scope.dtInstance.dataTable.fnClearTable();
                            $scope.dtInstance.dataTable.fnAddData($scope.gridInfo.data);
                            $scope.gridInfo.tableInstance = $scope.dtInstance.DataTable;
                            $scope.gridInfo.instance = $scope;
                            window.setTimeout(function () {
                                $(window).trigger("resize")
                            }, 200);
                        });
                    }
            }

            loadData();
            function loadData() {
                coreService.getList($scope.gridInfo.sysViewID, function (data) {
                    $scope.gridInfo.data = angular.copy(data[1]);
                    $scope.dtInstance.dataTable.fnClearTable();
                    $scope.dtInstance.dataTable.fnAddData($scope.gridInfo.data);
                    $scope.gridInfo.tableInstance = $scope.dtInstance.DataTable;
                    $scope.gridInfo.instance = $scope;
                    window.setTimeout(function () {
                        $(window).trigger("resize")
                    }, 200);
                });
            }

            function standardFields(fields) {
                var columns = [];
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    columns.push(standardField2Column(field));
                }
                return columns;
            }
            $scope.actionClick = function (row, act, obj) {

                $scope.gridInfo.onActionClick(row, act)
            }

            function standardField2Column(field) {
                var col = DTColumnBuilder.newColumn(field.name);
                col.withTitle(field.heading);
                col.notSortable();
                if (typeof field.className == 'undefined')
                    field.className = '';
                col.withClass(field.name + " " + field.className);
                switch (field.type) {
                    //case controls.ICON_AND_TEXT:
                    //    col.notSortable();
                    //    col.renderWith(function (data, type, full, meta) {

                    //        return [
                    //           //'<i  ng-click="action(data,field)" class="fa ', field.classIcon, '">&nbsp;&nbsp;', data, '</i>'
                    //            '<i  ng-click="action(', full.ID, ",\'", field.name, '\')" class="fa ', field.classIcon, '">&nbsp;&nbsp;', data, '</i>'
                    //        ].join('');
                    //    });
                    //    break;

                    case controls.LIST_ICON:
                        col.notSortable();
                        col.renderWith(function (data, type, full, meta) {

                            var result = '';

                            angular.forEach(field.listAction, function (value, key) {
                                result += '<i  ng-click="actionClick(' + full.ID + ",\'" + value.action + '\',this)" class="fa ' + value.classIcon + '">&nbsp;&nbsp;' + '</i>';
                            });

                            return result;
                        });
                        break;

                    default:

                        break;
                }

                return col;

            }

        }
    }
})




