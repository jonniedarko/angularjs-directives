var app = angular.module('directivesApp');

app.directive('helloWorld', function () {
    return {
        restrict: 'A',
        replace: true,
        template: '<h3>Hello from a Directive</h3>'
    };
});

app.directive('helloAgain', function () {
    return {
        restrict: 'ECM',
        replace: false,
        template: '<h3>Hello from a Directive</h3>'
    };
});

app.directive('helloUser', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: true,
        template: '<h3>Hello {{username}} from a Directive</h3>',
        link: function (scope, elem, attr){
            scope.index = 0;
            scope.users = ["Colin", "Martin", "Greg", "Victor"];

            scope.username = attr.username;

            function setUsername (){
                scope.$apply(scope.index++);
                if(scope.index > scope.users.length-1){
                    scope.$apply(scope.index=0);
                }
                scope.$apply(scope.username = scope.users[scope.index]);
            }

            elem.bind('click', function () {
                setUsername()
                if(elem.css('background-color') == 'rgba(0, 0, 0, 0)')
                {
                   elem.css('background-color', 'rgb(255, 0, 0)');
                   elem.css('color', 'rgb(255, 255, 255, 0)');
                } else {
                    elem.css('background-color', 'rgba(0, 0, 0, 0)');
                    elem.css('color', 'rgb(0, 0, 0)');
                }
            });
        }
    };
});