/// <reference path="../../Templates/directive/Action/form-Action.html" />
/// <reference path="../../Templates/directive/Action/form-Action.html" />
'use strict';
angular.module('indexApp')
// Controller ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('BodyController', function ($scope, toaster, myFactory) {
        $scope.navigation = $adminCMS.data.navigation;
        $scope.currentUser = $adminCMS.data.user;
        $scope.sidebarNavigation = $adminCMS.data.navigation.sidebarNav;
        $scope.server = $adminCMS.data.server;
        $scope.serverList = $adminCMS.data.serverList;
    })

    .controller('loginController', function ($scope, $location, myFactory) {
        $scope.userInfo = { "userName": "thanh", "password": "123456" };
        $scope.signIn = function (user) {
            console.log("user", user);

            //myFactory.userAuth(user).then(
            //    function () {
            //        $location.path("/controlPanel/upload-files");
            //    },
            //    function () {
            //        alert("error");
            //    })

            $location.path("/index");
            //myFactory.userAuth(user).$promise.then(
            //   function () {
            //       $location.path("/index");
            //   },
            //   function () {
            //       alert("error");
            //   })

            //if (user.userName == $scope.userInfo.userName && user.password == $scope.userInfo.password) {
            //    //alert("sign in!");
            //    $location.path("/controlPanel/upload-files");
            //}
            //else {
            //    alert("Reject!");
            //}
        }
    })
        .controller('UserCtrl', function ($scope, $location, myFactory) {
            $scope.themeButton = 'btn-success';
            $scope.signIn = function (user) {
                console.log("user", user);

                //myFactory.userAuth(user).then(
                //    function () {
                //        $location.path("/controlPanel/upload-files");
                //    },
                //    function () {
                //        alert("error");
                //    })

                $location.path("/index");
                //myFactory.userAuth(user).$promise.then(
                //   function () {
                //       $location.path("/index");
                //   },
                //   function () {
                //       alert("error");
                //   })

                //if (user.userName == $scope.userInfo.userName && user.password == $scope.userInfo.password) {
                //    //alert("sign in!");
                //    $location.path("/controlPanel/upload-files");
                //}
                //else {
                //    alert("Reject!");
                //}
            }
        })

    .controller('uploadController', function ($scope, FileUploader, toaster, myFactory) {
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
            myFactory.popupNotification({
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


//Factory //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .factory('myFactory', ['$window', '$compile', '$http', '$q', '$resource', function ($window, $compile, $http, $q, $resource) {
        var myFactory = {};

        //myFactory.userAuth = function (user) {
        //    var deferred = $q.defer();
        //    $http.post('/api/userAuth/post/', user)
        //    .success(function () {
        //        deferred.resolve();
        //    })
        //    .error(function () {
        //        deferred.reject();
        //    })
        //    return deferred.promise;
        //}
        myFactory.userAuth = function (user) {
            return $resource('/api/userAuth').save(user);
        }
        myFactory.popupNotification = function (options) {
            //Bootstrap modal settings
            var modalSettings = {
                backdrop: 'static', //set to 'static' to dismiss close modal by clicking on overlay background
                keyboard: true,
                show: true,
                remote: false
            };
            //Default popup content
            var popupSettings = {
                popupType: 'alert',  //confirm, alert, open
                popupStatus: '', //success, info, warning, danger
                title: '',
                message: '',
                htmlTemplate: '', //insert html template
                iframe: ''
            };

            if (options && Object.keys(options).length > 0) {
                options = angular.fromJson(options);

                angular.extend(popupSettings, options);

                var popupType = popupSettings.popupType,
                    popupStatus = popupSettings.popupStatus,
                    title = popupSettings.title,
                    message = popupSettings.message,
                    htmlTemplate = popupSettings.htmlTemplate,
                    iframe = popupSettings.iframe;

                if (!popupType || popupType.length === 0)
                    popupType = 2;

                var template = '';

                switch (popupType) {
                    case 'confirm':
                        template = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                                  + '<div class="modal-dialog">'
                                    + '<div class="modal-content">'
                                      + '<div class="modal-header alert-' + popupStatus + '">'
                                        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                                        + '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>'
                                      + '</div>'
                                      + '<div class="modal-body">'
                                             + '<p style="display:inline;"> ' + message + '</p>'
                                      + '</div>'
                                      + '<div class="modal-footer">'
                                        + '<button type="button" class="btn btn-' + popupStatus + '">OK</button>'
                                        + '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
                                      + '</div>'
                                    + '</div>'
                                  + '</div>'
                                + '</div>';
                        console.log("template: confirm");
                        break;

                    case 'alert':
                        template = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                                  + '<div class="modal-dialog">'
                                    + '<div class="modal-content">'
                                      + '<div class="modal-header alert-' + popupStatus + '">'
                                        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                                        + '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>'
                                      + '</div>'
                                      + '<div class="modal-body">'
                                             + '<p style="display:inline;"> ' + message + '</p>'
                                             + '<div class="overflow">' + htmlTemplate + ' </div>'
                                      + '</div>'
                                      + '<div class="modal-footer">'
                                        + '<button type="button" class="btn btn-' + popupStatus + '" data-dismiss="modal">OK</button>'
                                      + '</div>'
                                    + '</div>'
                                  + '</div>'
                                + '</div>';
                        console.log("template: alert");
                        break;

                    case 'open':
                        template = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                                  + '<div class="modal-dialog">'
                                    + '<div class="modal-content">'
                                      + '<div class="modal-header alert-' + popupStatus + '">'
                                        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                                        + '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>'
                                      + '</div>'
                                      + '<div class="modal-body">'
                                            + '<p style="display:inline;"> ' + message + '</p>'
                                             + '<div class="overflow">' + htmlTemplate + ' </div>'
                                             + '<div class="overflow"><iframe src=' + iframe + ' style="width:100%"></iframe></div>'
                                      + '</div>'
                                    + '</div>'
                                  + '</div>'
                                + '</div>';
                        console.log("template: open");
                        break;

                    default:
                        template = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                                  + '<div class="modal-dialog">'
                                    + '<div class="modal-content">'
                                      + '<div class="modal-header alert-' + popupStatus + '">'
                                        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                                        + '<h4 class="modal-title" id="myModalLabel">Modal title</h4>'
                                      + '</div>'
                                      + '<div class="modal-body">'
                                             + message
                                      + '</div>'
                                      + '<div class="modal-footer">'
                                        + '<button type="button" class="btn btn-' + popupStatus + '">OK</button>'
                                        + '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
                                      + '</div>'
                                    + '</div>'
                                  + '</div>'
                                + '</div>';
                        console.log("template: default");
                        break;


                }
                var $body = angular.element(document.querySelector('body'));
                $body.find('#myModal').remove();
                $body.append(template);
                $compile(template)($body.scope());
            }//end If
            $('#myModal').modal(modalSettings);
        }

        return myFactory;
    }])


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
         scope: {
             themeButton: '=',
             fullAction:'='
         },
     };
 })
 .directive('leftAction', function ($timeout) {
     return {
         restrict: 'EA',
         replace: true,
         templateUrl: '/Templates/directive/form/left-Action.html',
         scope: {
             themeButton: '='
         },
     };
 })


