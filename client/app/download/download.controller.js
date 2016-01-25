'use strict';

angular.module('lotusvoiceApp')
  .controller('DownloadCtrl',['$http', '$scope' ,function ($http, $scope) {

    $scope.files = [];

    $http.get('/api/files').success(function(files) {
      console.log(files);
      $scope.files = files;
    });
  }]);

