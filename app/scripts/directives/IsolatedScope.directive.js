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
           //wraps the funtion in an anymous function to allow 
           //to be called in an expression in our template
           scope.expressnum = scope.expressnum();

        }
        ,template:'<div><p> using "@" = {{attnum+attnum}}</p>'+
                        '<p>using "=" {{bindnum+bindnum}}</p>'+
                        '<p>using "&" {{expressnum(bindnum)}}</p><br/><p>{{y}}</p>'+
                '</div>'

    };

});