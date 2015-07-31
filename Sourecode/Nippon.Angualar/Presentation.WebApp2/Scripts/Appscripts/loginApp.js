
angular.module('loginApp', [])
.controller('loginController', function ($scope, $location) {
    $scope.userInfo = { "userName": "", "password": "123456" };
    $scope.signIn = function () {
        window.location.assign("app.html")
      
       // console.log("user", user);

        //myFactory.userAuth(user).then(
        //    function () {
        //        $location.path("/controlPanel/upload-files");
        //    },
        //    function () {
        //        alert("error");
        //    })

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
