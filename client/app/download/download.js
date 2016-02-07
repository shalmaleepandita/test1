'use strict';

angular.module('lotusvoiceApp')
  .config(function ($stateProvider) {
  $stateProvider
    .state('download', {
      url: '/download/:fileId',
      templateUrl: 'app/download/download.html',
      controller: 'DownloadController',
      controllerAs: 'download'
    });
});
