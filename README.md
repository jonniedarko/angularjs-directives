Angular Directives
========================

###What is a Directive and why are they used?
In Angularjs a Directive is a marker on the DOM element that tells Angularjs's HTML compiler  to attach specific behaviour to that DOM element or transform teh element and its children.They are used to make custom reusable HTML elements while making DOM manipulation easier.

Some built in Directives of Angularjs include `ngBind`, `ngModel`, `ngView`. When Angular bootstraps your application the HTML compiler traverses the DOm matching directives against the DOM Elements


Their are four types of directives

 * Attribute  (A)  `<div my-directive></div>`
 * Element (E)    `<my-directive></my-directive>`
 * Class (C)     `<div class="my-directive"></div>`
 * Comment (M)   `<!--directive:my-directive-->`


####Creating a simple HelloWorld Directive
To create a directive we use need to use the modules `.directive()` method

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

Then to see the result I can place any element with the `hello-world` attribute into my HTML e.g.
```html
<div hello-world>Some Random Text that will be replaced by our directive</div>
```
**Note:** for the directive name we use *camelCase* in our script files and in html it is *all-lower-case-with-dashes-between-words*. In our example `helloWorld` in Javascript and `hello-world` in the HTML element

####[PLACEHOLDER: Explaine and demo replace: false]

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

######Directive Scopes and link function
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
                if(scope.index > scope.users.length){
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

[PlaceHolder for $apply info]


Enter `scope.$apply()`

wrap the setUsername() with the $apply() `scope.$apply(setUsername());`.

BAM! now it works. 

But theres still one Manager Issue that you may propably haven't noticed. Add a second `hello-user` element to your page. Now do you see? when you click one, the name on all other instances of the directive update too....but what if thats not what you want? What if you want them all to only work per instance.

[Placeholder scope] 




Sources

 * http://docs.angularjs.org/guide/directive
 * http://stackoverflow.com/questions/13125899/how-to-set-up-attributes-in-angularjs-directive-restricted-to-comments
 * http://www.sitepoint.com/practical-guide-angularjs-directives/