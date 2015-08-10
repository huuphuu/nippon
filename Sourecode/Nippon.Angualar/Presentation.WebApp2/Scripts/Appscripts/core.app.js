﻿//-----------------------------------------------------------------------------
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
        html: {
            encode: function (text) {
                var ret = '';
                text = '' + text;
                if (typeof text == "string") {
                    ret = text
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }
                return ret;
            },
            decode: function (text) {
                var ret = '';
                text = '' + text;
                if (typeof text == "string") {
                    ret = text
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, '\'')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/\\u0026amp;/g, '&')
                        .replace(/\\u0026quot;/g, '"')
                        .replace(/\\u0026#39;/g, '\'')
                        .replace(/\\u0026lt;/g, '<')
                        .replace(/\\u0026gt;/g, '>');
                }
                return ret;
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
        objectToXML: function (tagName, data) {
            var objThis = this;
            var inputs = [],
                ret = '';
            angular.forEach(data, function (value, key) {
                if (typeof value != "function" && typeof value != "object") {
                    // value = html.decode(value);
                    inputs.push($.string.Format('{0}="{1}" ', key, objThis.html.encode(value)));
                }
            });
            ret = $.string.Format('<{0} {1}/>', tagName, inputs.join(' '));

            return ret;
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
                    url: 'Core/CoreService.asmx/' + fnName,
                    data: {
                        clientKey: a.systemConfig.clientKey,
                        inputValue: a.html.encode(inputValue)
                    }
                }, callback);
            };
            this.execute2 = function (url, fnName, inputValue, callback) {
                return a.callAjax({
                    url: url + '/' + fnName,
                    data: {
                        clientKey: a.systemConfig.clientKey,
                        inputValue: a.html.encode(inputValue)
                    }
                }, callback);
            };
            this.getContextData = function (inputValue, callback) {
                return this.execute('GetContextData', inputValue, callback);
            };
            this.getList = function (viewID, callback) {
                var inputValue = a.objectToXML('InputValue', { UserID: 0 }) + a.objectToXML('RequestParams', { Sys_ViewID: viewID }); //$.string.Format('<InputValue UserID=""/><RequestParams Sys_ViewID="{0}"/>', viewID);
                return this.execute('GetContextData ', inputValue, callback);
            };
            this.actionEntry = function (data, callback) {
                var inputValue = a.objectToXML('InputValue', { UserID: 0 }) + a.objectToXML('RequestParams', data);
                return this.execute('ExecuteAction ', inputValue, callback);
            };
            this.callServer = function (url, fnName, data, callback) {
                var inputValue = a.objectToXML('InputValue', data);
                return this.execute2(url, fnName, inputValue, callback);
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
        },

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