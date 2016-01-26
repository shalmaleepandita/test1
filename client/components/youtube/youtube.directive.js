'use strict';
/* global YT */

angular.module('lotusvoiceApp')
  .directive('youtube', function($window, youTubeApiService) {
    return {
      restrict: 'E',

      scope: {
        height: '@',
        width: '@',
        videoid: '@'
      },

      template: '<div></div>',

      link: function(scope, element) {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        function setupPlayer(scope, element) {
          return new YT.Player(element.children()[0], {
            playerVars: {
              autoplay: 0,
              html5: 1,
              theme: 'light',
              modesbranding: 0,
              color: 'white',
              showinfo: 1,
              controls: 1
            },

            height: scope.height,
            width: scope.width,
            videoId: scope.videoid,
          });
        }
        var player;
        youTubeApiService.onReady(function() {
          player = setupPlayer(scope, element);
        });
      }
    };
  });
