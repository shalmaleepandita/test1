'use strict';

angular.module('lotusvoiceApp.auth', [
  'lotusvoiceApp.constants',
  'lotusvoiceApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
