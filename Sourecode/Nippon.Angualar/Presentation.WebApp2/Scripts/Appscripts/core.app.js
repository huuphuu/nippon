//-----------------------------------------------------------------------------
//SERVICE
//-----------------------------------------------------------------------------
var coreApp;
(function () {
    coreApp = {
        cookie: {
            set: function (name, value, exdays) {
                if (typeof exdays == 'undefined') exdays = 7;
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + exdays);

                value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
                document.cookie = name + "=" + value + '; path=/';
            },
            get: function (name) {
                var i, x, y,
                    r = '',
                    ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == name) {
                        r = unescape(y);
                    }
                }
                return r;
            }
        },
        xml: {
            getContent: function (xmlString, tagName) {
                tagName = tagName || "string";
                var ret = xmlString;
                if (xmlString) {
                    ret = $(xmlString).find(tagName).text();
                }
                return ret;
            }
        },
        callAjax: function (options, callback) {
            if (options) {
                var defOptions = {
                    type: 'POST',
                    dataType: "xml",
                    success: function (data, textStatus, jqXHR) {
                        if (data) {
                            data = coreApp.xml.getContent(data);
                            data = data.CSV2JSON2();

                            if (typeof callback == 'function') {
                                callback(data);
                            }
                        }
                    }
                };

                $.extend(defOptions, options, true);

                return this.ajax(defOptions);
            }
            return null;
        },
        ajax: function (options) {
            options.timeout = 3600000;
            options.url = location.origin + '/service.data/' + options.url;

            var showOverlay = options.showOverlay,
                beforeSend = options.beforeSend,
                error = options.error,
                success = options.success;

            //custom 
            options.beforeSend = function (jqXHR, settings) {
                if (typeof beforeSend == 'function') {
                    beforeSend(jqXHR, settings);
                }
                if (showOverlay) {
                    //show overlay here
                }
            };
            options.error = function (jqXHR, textStatus, errorThrown) {
                if (typeof error == 'function') {
                    error(jqXHR, textStatus, errorThrown);
                }
                if (showOverlay) {
                    //hide overlay here
                }
            };

            options.success = function (data, textStatus, jqXHR) {
                if (typeof success == 'function') {
                    success(data, textStatus, jqXHR);
                }
                if (showOverlay) {
                    //hide overlay here
                }
            };

            return $.ajax(options);
        }
    }
})();
(function (a) {
    a.systemConfig = {
        clientKey: a.cookie.get('iMarket:Session:Username'),
        userName: a.cookie.get('iMarket:Session:Username'),
        userID: a.cookie.get('iMarket:Session:UserID'),
        sessionKey: a.cookie.get('iMarket:Session:SessionID'),
        clientGroupID: a.cookie.get('iMarket:Session:ClientGroupID'),
    };
})(coreApp);
(function (a) {
    a.service = {
        core: function () {
            this.execute = function (fnName, inputValue, callback) {
                return a.callAjax({
                    url: 'apiproduct/core/coreservice.asmx/' + fnName,
                    data: {
                        userID: a.systemConfig.userID,
                        userName: a.systemConfig.userName,
                        session: a.systemConfig.sessionKey,
                        inputValue: inputValue
                    }
                }, callback);
            };

            this.getContextData = function (inputValue, callback) {
                console.log('getContextData', inputValue);
                return false;
                return this.execute('GetContextData', inputValue, callback);
            };
        },
        //gird infomation
        grid: function () {
            this.execute = function (fnName, inputValue, callback) {
                return a.callAjax({
                    url: 'Core/CoreService.asmx/' + fnName,
                    data: {
                        clientKey: a.systemConfig.clientKey,
                        inputValue: inputValue
                    }
                }, callback);
            };

            this.getList = function (viewID, callback) {
                var inputValue = $.string.Format('<InputValue UserID=""/><RequestParams Sys_ViewID="{0}"/>', viewID);
                return this.execute('GetContextData ', inputValue, callback);
            };
        }
    }
})(coreApp);
//-----------------------------------------------------------------------------
//SERVICE
//-----------------------------------------------------------------------------
angular.module('app.service', [])
    .service('coreService', coreApp.service.core)
    .service('gridService', coreApp.service.grid)
//.service('securitiesService', coreApp.service.securities)

//.service('porfolioService', coreApp.service.portfolio)

//.service('orderService', coreApp.service.order)

//.service('priceboardService', coreApp.service.priceboard)

//.service('filledInfoService', coreApp.service.filledInfo)
;