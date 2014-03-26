var app = angular.module('directivesApp');

app.directive('simplyIsolated', function () {
    return{
        restrict: 'EA',
        replace: true,
        scope:{
            attnum: '@numone'
            ,bindnum: '=numtwo'
            ,expressnum: '&sq'
        }
        ,link: function (scope, elem, attr){
           scope.isolateSq = scope.expressnum();
        }
        ,template:'<div><p> using "@" = {{attnum+attnum}}</p>'+
                        '<p>using "=" {{bindnum+bindnum}}</p>'+
                        '<p>using "&" {{isolateSq(bindnum)}}</p><br/><p>{{y}}</p>'+
                '</div>'

    };

});