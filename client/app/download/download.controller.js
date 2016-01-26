'use strict';

(function() {

  class DownloadController {

    constructor($http, $stateParams) {
      this.$http = $http;
      this.files = [];
      this.fileId = $stateParams.fileId;

      if(this.fileId == '') {
        $http.get('/api/files').then(response => {
          this.files = response.data;
        });
      } else {
        $http.get('/api/files/' + this.fileId).then(response => {
          this.files = response.data;
        });
      }
    }
  }

  angular.module('lotusvoiceApp')
    .controller('DownloadController', DownloadController);

})();
