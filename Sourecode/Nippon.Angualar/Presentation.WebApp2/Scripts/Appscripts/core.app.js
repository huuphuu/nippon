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
        ///npn: Ham goi rieng cho action
        // data: {Success:true, Message:{Name:'OK',Description:'OK'}, Result:1}
        callAjaxAction: function (options, callback) {
            if (options) {
                var defOptions = {
                    type: 'POST',
                    dataType: "xml",
                    success: function (data, textStatus, jqXHR) {
                        if (data) {
                            data = coreApp.xml.getContent(data);
                            data = data.CSV2JSON2();
                            //Data nhan duoc la 1 array 2 chieu
                            //data[0] la ket qua trang thai request
                            //data[1] ket qua ham tra ve, neu data[0] false thi data[1] co the khong co
                            var result = {};
                            if (data == undefined || data.length == 0 || data[0].length == 0) {
                                result.Message = { Name: "Error", Description: "Unknow error: no data received." };
                                result.Success = false;
                            } else if (data[0][0].Result != '' && data[0][0].Result > 0) { //Neu data[0] OK
                                if (data.length > 1 && data[1].length > 0) {
                                    if (data[1][0].Result != '' && data[1][0].Result > 0) { //Neu data[1] OK
                                        result.Message = data[1][0];
                                        result.Result = data[1][0].Result;
                                        result.Success = true;
                                        if (data.length > 2) { //Neu co tra ve du lieu
                                            result.Entry = data[2];
                                        }
                                    } else {
                                        result.Message = data[1][0];
                                        result.Success = false;
                                    }
                                } else {
                                    result.Message = { Name: "Error", Description: "Unknow error: Request ok." };
                                    result.Success = false;
                                }

                            } else {
                                result.Message = data[0][0];
                                result.Success = false;
                            }
                            if (typeof callback == 'function') {
                                callback(result);
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
        objectToXMLEx: function (tagName, data) {
            var objThis = this;
            var inputs = [],
                ret = '';
            var childInput = "";
            angular.forEach(data, function (value, key) {
                if (key.indexOf("$") >= 0) return;
                if (typeof value != "function" && typeof value != "object") {
                    // value = html.decode(value);
                    inputs.push($.string.Format('{0}="{1}" ', key, objThis.html.encode(value)));
                } else if (angular.isArray(value)) {
                    angular.forEach(value, function (item, notuse) {
                        childInput += objThis.objectToXMLEx(key, item);
                    });
                } else if (angular.isObject(value)) {
                    childInput = objThis.objectToXMLEx(key, value);
                }
            });
            ret = $.string.Format('<{0} {1}>', tagName, inputs.join(' '));
            ret += childInput;
            ret += $.string.Format('</{0}>', tagName);
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
            userID: 0,
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
            this.executeAction = function (fnName, inputValue, callback) {
                return a.callAjaxAction({
                    url: 'Core/CoreService.asmx/' + fnName,
                    data: {
                        clientKey: a.systemConfig.clientKey,
                        inputValue: a.html.encode(inputValue)
                    }
                }, callback);
            };
            this.getContextData = function (inputValue, callback) {
                return this.execute('GetContextData', inputValue, callback);
            };
            this.getViewData = function (objInput, callback) {
                var inputValue = a.objectToXML('InputValue', { UserID: this.userID }) + a.objectToXML('RequestParams', objInput); //$.string.Format('<InputValue UserID=""/><RequestParams Sys_ViewID="{0}"/>', viewID);
                return this.execute('GetContextData ', inputValue, callback);
            };
            this.getList = function (viewID, callback) {
                var inputValue = a.objectToXML('InputValue', { UserID: this.userID }) + a.objectToXML('RequestParams', { Sys_ViewID: viewID }); //$.string.Format('<InputValue UserID=""/><RequestParams Sys_ViewID="{0}"/>', viewID);
                return this.execute('GetContextData ', inputValue, callback);
            };
            this.getListEx = function (option, callback) {
                var inputValue = a.objectToXML('InputValue', { UserID: this.userID }) + a.objectToXML('RequestParams', option); //$.string.Format('<InputValue UserID=""/><RequestParams Sys_ViewID="{0}"/>', viewID);
                return this.execute('GetContextData ', inputValue, callback);
            };
            this.actionEntry = function (data, callback) {
                var inputValue = a.objectToXMLEx('InputValue', { UserID: this.userID }) + a.objectToXMLEx('RequestParams', data);
                //console.log("inputValue", inputValue);
                return this.execute('ExecuteAction ', inputValue, callback);
            };
            this.actionEntry2 = function (data, callback) {
                var inputValue = a.objectToXMLEx('InputValue', { UserID: this.userID }) + a.objectToXMLEx('RequestParams', data);
                //console.log("inputValue", inputValue);
                return this.executeAction('ExecuteAction ', inputValue, callback);
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
        authorities: function () {
            this.listRight = null,
            this.set = function (data) {
                this.listRight = data;
            };
            this.get = function (viewID) {
                if (this.listRight == null)
                    return null;
                if (typeof viewID == 'undefined')
                    return this.listRight;
                viewID += '';
                for (var i = 0; i < this.listRight.length; i++) {
                    if (this.listRight[i].ViewID == viewID)
                        return this.listRight[i];
                }

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
    .service('authoritiesService', coreApp.service.authorities)
//.service('securitiesService', coreApp.service.securities)

//.service('porfolioService', coreApp.service.portfolio)

//.service('orderService', coreApp.service.order)

//.service('priceboardService', coreApp.service.priceboard)

//.service('filledInfoService', coreApp.service.filledInfo)
;