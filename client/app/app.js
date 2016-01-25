'use strict';

angular.module('lotusvoiceApp', [
  'lotusvoiceApp.auth',
  'lotusvoiceApp.admin',
  'lotusvoiceApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
