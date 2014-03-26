'use strict';

angular.module('directivesApp')
  .controller('MainCtrl', function ($scope) {

    $scope.square = function(num){
        return num*num;
    }

  });
