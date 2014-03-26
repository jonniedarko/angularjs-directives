'use strict';

angular.module('directivesApp')
  .controller('MainCtrl', function ($scope) {

    $scope.sqr = function(num){
        return num*num;
    }

  });
