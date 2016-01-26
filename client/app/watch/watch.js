'use strict';

angular.module('lotusvoiceApp')
  .config(function ($stateProvider) {
  $stateProvider
    .state('watch', {
      url: '/watch',
      templateUrl: 'app/watch/watch.html',
      controller: 'WatchController',
      controllerAs: 'watch'
    });
});


