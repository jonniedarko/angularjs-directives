Angular Directives
========================
#### Prerequisite's

 * [Create a basic MEAN stack app with Yeoman](todo)
 * [Angularjs Basics](todo)

####Overview
 * What is a directive
 * Creating our first basic Directive
 * Multiple 'restrict' types
 * Why So Static? Creating dynamic directives
    * Giving a Directive a Scope and a link function
    * A brief intro to scope.$apply()
    * Directive scope in detail

###What is a Directive and why are they used?
In Angularjs, a Directive is a *marker* on the DOM element that tells Angularjs's HTML compiler to attach specific behavior to that DOM element or to transform the element and its children.They are used to make custom reusable HTML elements while making DOM manipulation easier.

Some built in Directives of Angularjs include [ngBind](http://docs.angularjs.org/api/ng/directive/ngBind), [ngModel](http://docs.angularjs.org/api/ng/directive/ngModel), & [ngView](http://docs.angularjs.org/api/ngRoute/directive/ngView). When Angular bootstraps your application the HTML compiler traverses the DOM, matching directives against the DOM Elements.


Their are four types of directives

 * Attribute  (A)  `<div my-directive></div>`
 * Element (E)    `<my-directive></my-directive>`
 * Class (C)     `<div class="my-directive"></div>`
 * Comment (M)   `<!--directive:my-directive-->`


####Creating a simple HelloWorld Directive
To create a directive we use need to use the module `.directive()` method. So lets create a basic directive:

```js
    var app = angular.module('app'); //gets the app

    app.directive('helloWorld', function () { //creates the directive called 'helloWorld'
        return {
            restrict: 'A', // Restricts the directive to an Attribute
            replace: 'true', //replaces the original HTML element with the result
            template: '<h3>Hello from a Directive</h3>'
        }
    });
```

Then to see the result I can place any element with the ` hello-world ` attribute into my HTML e.g.
```html
<div hello-world>Some Random Text that will be replaced by our directive</div>
```
**Note:** for the directive name we use *camelCase* in our script files and in html it is *all-lower-case-with-dashes-between-words*. In our example `helloWorld` in Javascript and `hello-world` in the HTML element

####[PLACEHOLDER: Explain and demo replace: false]

#####Multiple 'restrict' types
We are not limited to a single type as we show in our next example
```js
    app.directive('helloAgain', function () {
    return {
        restrict: 'ECM',
        replace: true,
        template: '<h3>Hello from a Directive</h3>'
    };
});
```

Her we are restricting the the directive to work as:

 * its own Element using `<hello-again>Blah blah blah</hello-again>`
 * an Elements Class using `<div class="hello-again">more pointless text</div>`
 * a HTML comment using `<!--directive: hello-again -->`



####Why So Static?
Ok now we can easliy build massive large directives that do loads of complex things using a well written HTMl template, that must be all we need now! Hell No! templates should be as simple and concise as possible and really should be generic and reusable. So How do we do this?

There are a few ways we can make things a little more dynamic but lets give it some context....

######Directive Scopes and the link function
The template of a directive isn't much use if it’s not compiled against the right scope. By default a directive does not get a new child scope, but instead gets it's parent's scope. For example if we used our directive inside an element that has a controller, by default the direcitve uses the controllers scope.

Back to our case, generic is boring so rather then Just have a generic Hello, lets get it to accept a name to say hello to a user. This is where we introduce the link function and give the directive a Scope to work with. So lets create a new directive:

```js

app.directive('helloUser', function () {
    return {
        restrict: 'EA',
        replace: true,
        template: '<h3>Hello {{username}} from a Directive</h3>',
        link: function (scope, elem, attr){
                scope.username = attr.username;
        }
    };
});

```
now when we add the either of following to our HTML we get the same result as our `helloAgain` directive
```html
<hello-user ></hello-user>
<div hello-user></div>
```
But we wanted to say Hello to some one! easy....
```html
<hello-user username="John"></hello-user>
<div hello-user username="John"></div>
```


variables and attributes are great and all but....I know a little boring. Lets snazz this directive up. lets make it cycle throught a few color schemes on click.

```js
app.directive('helloUser', function () {
    return {
        restrict: 'EA',
        replace: false,
        template: '<h3>Hello {{username}} from a Directive</h3>',
        link: function (scope, elem, attr){

            scope.username = attr.username;

            elem.bind('click', function () {

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
```

`elem` here is a JQuery lite selector for the element of the directive, and we are using the jquery `bind()` method to bind the anyonoums function to the click action type. Inside we are just doing regular jquery css manipulation.

But what if we want to change the name on each click. Easy, set up an array of users and an index for tracking selection. Inside the current click method increment the index used to set the scope's username using the array[index].

```js
app.directive('helloUser', function () {
    return {
        restrict: 'EA',
        replace: false,
        template: '<h3>Hello {{username}} from a Directive</h3>',
        link: function (scope, elem, attr){
            scope.index = 0;
            scope.users = ["Colin", "Martin", "Greg", "Victor"];

            scope.username = attr.username;

            function setUsername (){
                scope.index++;
                if(scope.index > scope.users.length-1){
                    scope.index=0
                }
                scope.username = scope.users[scope.index];
            }

            elem.bind('click', function () {

                setUsername();

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
```

Easy Right? But wait it doesn't work. When I click the colors still change but no name change.....

[PlaceHolder for $apply info, look at difference between variable assigning and a function in the $apply method]


Enter `scope.$apply()`

wrap the scope varible updates in setUsername() with the $apply()

```js
app.directive('helloUser', function () {
    return {
        restrict: 'EA',
        replace: false,
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
```


BAM! now it works.

But theres still one Manager Issue that you may propably haven't noticed. Add a second `hello-user` element to your page. Now do you see? when you click one element, the name on all other instances of the directive update too. But the css only update on the clicked instance....

####Scope
Whats happening is all the instances are sharing a scope, this is why all scope changes occure across all instances while element changes, like our css change, do not.

looking out our directive's returned object while you may not realises it but there are other attributes that have defaults even if we don't specify.

`scope: false` is the default scope option and does not create a new scope but instead inherits from the parent's scope. This is the reason out directive has the previously mentioned issue.

`scope: true` creates a new scope but prototypically inherits from the parent scope.

so if we add true instead of the default then the directives don't share the same scope (but if the have the same parent scope they still share that).

#####Isolated Scope
`scope: 'isolate'` create an isolated Scope. It does not inherit from the parents scope. in this case if you want to access the parent's scope you need to use `scope.$parent`

An isolated scope also allows us to share data between other isolated scope and parent in 3 different ways:

* using the `@` for **one-way Text based binding**. It binds the value of the parent scope's property to the to the local isolated scope, always as a String. this means we can use `{{ propertyName }}` to access it in our template
* using the `=` for **two-way Type binding** binds the parent's scope property directly ( not just text, e.g. number as number not as string) and is evaluated before being passed in
* using the `&` **one way method binding** for Executing Functions in the Parent Scope. It binds an expression or method which is executed in the context of the scope it belongs to.

So lets create our first isolated directive...

```js
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
```

inside our controller :
```js
app.controller('MainCtrl', function ($scope) {
    //simple function to return a square of any number
    $scope.square = function(num){
        return num*num;
    }

  });
```
finally add a few more elements to our page
```html
<div>
  <input type="text" ng-model="num1parent" />
  <input type="number" ng-model="num2parent" />
  <input type="number" ng-model="num3parent" />
  <p>Parent Scope @ {{num1parent}}, = {{num2parent}}, & = {{sqr(num3parent)}}</p>
<div simply-isolated numone='{{num1parent}}' numtwo='num2parent' sq="square" ></div>

</div>
```
Enter `12` into our inputs and now our directive template shows the results:

 * the `@` results in `1212` because `12` in this case is treated as a String
 * the `=` results in `24` because `12` is a number and it is not converted/ treated as a string
 * the `&` results in `144` because it calls the function square from it's isolated scope which is assigned from the expressnum attribute which is bound to the attribute `sq` which is assigned the function `sqr`



####[Todo: part 2 - ]
info in this [ditective tutorial](http://www.sitepoint.com/practical-guide-angularjs-directives-part-two/) 
 * Transclusion

 * Controller
    * [Controller Vs Link function]( http://stackoverflow.com/questions/12546945/difference-between-the-controller-link-and-compile-functions-when-definin)
 * require
 * Good Directive use [example](http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs)



Sources

 * http://docs.angularjs.org/guide/directive
 * http://stackoverflow.com/questions/13125899/how-to-set-up-attributes-in-angularjs-directive-restricted-to-comments
 * http://www.sitepoint.com/practical-guide-angularjs-directives/
 * http://amitgharat.wordpress.com/2013/06/08/the-hitchhikers-guide-to-the-directive/


 * https://github.com/angular/angular.js/wiki/Understanding-Scopes
