angular.module('indexApp')
  .filter('dateDiff', function () {
      return function (d1, d2) {
          if (d2 == '')
              d2 = d1;
          return Math.floor((new Date(d2) - new Date(d1)) / 86400000);
      };
  })
  .filter('parseDateFromDB', function () {
      return function (d) {
          if (d == '') return null;
          return new Date(d);
      };
  })
.filter('getMinDate', function () {
    return function (d1, d2) {
        if (d2 == '')
            d2 = d1;
        return Math.floor((new Date(d2) - new Date(d1)) / 86400000) > 0 ? d1 : d2;
    }

})