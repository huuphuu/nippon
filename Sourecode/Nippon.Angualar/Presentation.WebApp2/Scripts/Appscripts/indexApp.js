'use strict';
angular.module('indexApp')
// Controller ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('BodyController', function ($scope, toaster, alertFactory) {
        $scope.navigation = $adminCMS.data.navigation;
        $scope.currentUser = $adminCMS.data.user;
        $scope.sidebarNavigation = $adminCMS.data.navigation.sidebarNav;
        $scope.server = $adminCMS.data.server;
        $scope.serverList = $adminCMS.data.serverList;
        $scope.themeButton = 'btn-success';
    })
    .controller('OfficerCtrl', function ($scope, $location, alertFactory) {
        $scope.gridInfo = {
            gridID: 'Employeegrid',
            cols: [{ name: 'Name', heading: 'Name', width: '30%' },
                   { name: 'Email', heading: 'Email', width: '40%' },
                   { name: 'Phone', heading: 'Phone', width: '30%' }
            ],
            data: dataEmployee
        }
        var columnDefs = [
        { headerName: "Make", field: "make", width: 30 },
        { headerName: "Model", field: "model", width: 30 },
        { headerName: "Price", field: "price", width: 40 }
        ];

        var rowData = [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxter", price: 72000 }
        ];

        $scope.gridOptions = {
            columnDefs: columnDefs,
            rowData: rowData,
            dontUseScrolls: true // because so little data, no need to use scroll bars
        };

    })
    .controller('uploadController', function ($scope, FileUploader, toaster, alertFactory) {
        // Uploader Plugin Code

        var uploader = $scope.uploader = new FileUploader({
            url: window.location.protocol + '//' + window.location.host + '/api/Upload/Asset'
            //window.location.pathname + 
        });

        // FILTERS

        uploader.filters.push({
            name: 'extensionFilter',
            fn: function (item, options) {
                var filename = item.name;
                var extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                return true;

                if (extension == "pdf" || extension == "doc" || extension == "docx" ||
                    extension == "rtf" || extension == "png" || extension == "js" || extension == ".min.js" || extension == "jpg" || extension == "css")
                    return true;
                else {
                    //alert('Invalid file format. Please select a file with pdf/doc/docs/png/js/.min.js/jpg or rtf format and try again.');
                    toaster.pop('error', "Invalid file format. Please select a file with pdf/doc/docs/png/js/.min.js/jpg or rtf format and try again.");
                    return false;
                }
            }
        });

        uploader.filters.push({
            name: 'sizeFilter',
            fn: function (item, options) {
                var fileSize = item.size;
                fileSize = parseInt(fileSize) / (1024 * 1024);
                if (fileSize <= 10)
                    return true;
                else {
                    alert('Selected file exceeds the 5MB file size limit. Please choose a new file and try again.');
                    return false;
                }
            }
        });

        uploader.filters.push({
            name: 'itemResetFilter',
            fn: function (item, options) {
                if (this.queue.length < 100)
                    return true;
                else {
                    //alert('You have exceeded the limit of uploading files.');
                    toaster.pop('error', "You have exceeded the limit of uploading files.");
                    return false;
                }
            }
        });

        // CALLBACKS
        uploader.previewItem = function (fileItem, serverPath) {
            var path = fileItem.file.serverPath.replace(/[\\]/g, '/');
            alertFactory.popupNotification({
                popupType: 'open',  //confirm, alert, open
                popupStatus: 'info', //success, info, warning, danger
                title: fileItem.file.name,
                message: '',
                htmlTemplate: '', //insert html template
                iframe: encodeURIComponent(path)
            });
        }
        uploader.deleteItem = function (fileItem, serverPath) {
            alert("delete File")
        }
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
            toaster.pop('error', item.name + " has been removed.");
        };
        uploader.onAfterAddingFile = function (fileItem) {
            //alert('Files ready for upload.');
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            //$scope.uploader.queue = [];
            fileItem.file.serverPath = response;
            //$scope.uploader.queue = $scope.uploader.queue.slice(1);
            //$scope.uploader.progress = 0;
            //alert('Selected file has been uploaded successfully.');

            toaster.pop('success', fileItem.file.name + " File Uploaded");
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            //alert('We were unable to upload your file. Please try again.');
            toaster.pop('error', "We were unable to upload your file. Please try again.");
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            alert('File uploading has been cancelled.');
            toaster.pop('error', "File uploading has been cancelled.");
        };

        uploader.onAfterAddingAll = function (addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            item.timeStamp = Date.now();
            item.prevProgress = 0;
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            var time = Date.now() - fileItem.timeStamp;
            var percent = (progress - fileItem.prevProgress) / 100;
            var chunk = percent * fileItem.file.size;
            var speed = ((chunk / 1024 / 1024) / (time / 1000)).toFixed(2);

            fileItem.timeStamp = Date.now();
            fileItem.prevProgress = progress;

            fileItem.speed = speed;
            $scope.speed = speed;
            $scope.percent = percent;
            //console.info('speed', speed, ' mb/sec');
            //console.info('speed', percent, ' mb/sec');
            //console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            //console.info('onProgressAll', progress);
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            //console.log("fileItem::::::::::", fileItem);
            //console.log("response::::::::::", response);
            //console.log("status::::::::::", status);
            //console.log("headers::::::::::", headers);
            if (status == 200) {
                //$scope.uploader.queue.file.serverPath = response;
                fileItem.uploader.queue.serverPath = response;
            }
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            //console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    })
    .controller("ListFilesController", function ($scope) {
        $scope.serverId = 1;
        $scope.servers = $scope.serverList;
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
    .directive('headerNavbarMenu', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                navigation: '=',
                currentUser: '='
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
                setTimeout(function () {
                    $.AdminLTE.tree('.sidebar');
                }, 100);
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

