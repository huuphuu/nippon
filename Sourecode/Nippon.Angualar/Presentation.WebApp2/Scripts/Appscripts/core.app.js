//-----------------------------------------------------------------------------
//SERVICE
//-----------------------------------------------------------------------------
var coreApp;
(function () {
    coreApp = {
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
            options.url = location.origin + '/iMarkets.Service.Data/' + options.url;

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
        }
    }
})(coreApp);
//-----------------------------------------------------------------------------
//SERVICE
//-----------------------------------------------------------------------------
angular.module('app.service', [])
    .service('coreService', coreApp.service.core)

//.service('securitiesService', coreApp.service.securities)

//.service('porfolioService', coreApp.service.portfolio)

//.service('orderService', coreApp.service.order)

//.service('priceboardService', coreApp.service.priceboard)

//.service('filledInfoService', coreApp.service.filledInfo)
;