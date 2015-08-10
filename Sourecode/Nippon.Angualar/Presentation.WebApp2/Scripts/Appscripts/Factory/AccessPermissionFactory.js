angular.module('indexApp')
.factory('accessFac', function (localStorageService) {
    var obj = {}
    this.access = false;
    obj.getPermission = function () {    //set the permission to true
        this.access = true;
    }
    obj.checkPermission = function () {
        var authData = localStorageService.get('authorizationData');			//returns the users permission level 
        if (authData == null)
            return false;
        return authData.isAuth == true;
    }
    return obj;
});
/*
 obj.getPermission = function () {    //set the permission to true
        this.access = true;
        var authData = localStorageService.get('authorizationData');
        return authData;
    }
    obj.checkPermission = function () {
        debugger;
        var authData = localStorageService.get('authorizationData');

        return authData.isAuth == true;
    })*/