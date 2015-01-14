# Tux/Animations

##Premise
>Tux Animations is a library of default animation components and easings. Additionally Tux Animations includes the createAnimation function which can be used to create custom animation components.

##Implementation
####1) Requiring Animations Components
The Tux Animations interface including all animation defaults can be exposed via:

```
  var Animations = require('tux/Animations');
```

#####Require only what you need
Tux is a modular framework and as such it is possible to require only the minimal number of files needed in order to save space in your app. For Example, if you need access to the default Fly and FadeUp animations in your implementation, you need only to require those specific animations via:

```
  var Fly = require('tux/Animations/Fly');
  var FadeUp = require('tux/Animations/Fade/Up');
```

####2) Rendering Animation Components
The only other step to implementing a Tux animation is to wrap the element you want animated with the desired animation component within the render method of your `React.createClass` function.

```
  render: function() {
    return (
      <Fly>
        <h1>Hello World</h1>
      </Fly>
    );
  }
```

![Animation 1](http://cdn.makeagif.com/media/1-12-2015/WjxMrn.gif)

#####Default Animations
In this implementation, the Fly component will inherit its default CSS transitions because no additional properties are defined. Each animation component has its own default CSS transitions which you can view in the source code of the animation.

####3) Customize Default Animation Properties
Tux also allows easy customization of default animation components via their properties. Each animation component has 4 properties which are customizable and are completely optional.

1. Duration
2. Delay
3. Easing
4. Custom

#####Duration Property - type: STRING or NUMBER - optional
The duration property, as the name would imply, determines the length of time for the animation sequence. Duration accepts a string with any standard CSS suffix or number input, but **beware** that numbers `will resolve in milliseconds`. The following two examples will both perform a 2 second long fly animation:

```
  <Fly duration="2s">
    <h1>Hello World</h1>
  </Fly>  //or
  <Fly duration={2000}>
    <h1>Hello World</h1>
  </Fly>
```

#####Delay Property - type: STRING or NUMBER - optional
The delay property sets a delay on the animation before it activates. The delay property is similar to the duration property in that it accepts either a string or number input. The following example will add a 1 second delay to our animation:

```
  <Fly duration={2000} delay={1000}>
    <h1>Hello World</h1>
  </Fly>
```

#####Easing Property - type: STRING - optional
The easing property determines what motion path the animation takes when presented. Easing only accepts a string which can take any custom cubic bezier animation path you wish. For example:

```
  <Fly duration={3000} delay={1000} easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)">
    <h1>Hello World</h1>
  </Fly>
```

The Easing property also accepts any of the Tux default easings as a string:

```
  <Fly duration={3000} delay={1000} easing="easeInOutBack">
    <h1>Hello World</h1>
  </Fly>
```

The Tux default easings and their motion paths are illustrated below. The 'Linear' path is not shown, but it is purely a straight line motion path.

![Easings](http://i.imgur.com/2XAGQgq.png "Easings")

#####Custom Property - type: OBJECT - optional
The custom property accepts an object as an input with any CSS properties you wish the animation to include in addition to the default CSS transitions inherent to the particular component. For Example, if you wanted the element you've wrapped with a Fly animation component to also animate to the color red and increase its font size to 14px, it's as easy as:

```
  <Fly duration={3000} delay={1000} easing="easeOutInBack" custom={{'color': 'red', 'font-size': '14px'}}>
    <h1>Hello World</h1>
  </Fly>
```

Finally, let's see how the default Fly animation looks now that it has been customized via its 4 default properties:

![Animation 2](http://cdn.makeagif.com/media/1-12-2015/9Hqmtk.gif)

####4) Make Your Own Animation Components
Requiring Tux Animations exposes a createAnimation function which allows the creation of custom animation components. The createAnimation function creates a custom component based on a passed in transition object and then wraps that custom component in a ReactTransitionGroup. The createAnimation function has one required parameter: `transitions` and two optional parameters: `customClassName` and `tagToRender`.

```
  createAnimation(transitions, customClassName, tagToRender);
```

#####Parameter - `transitions` - type: OBJECT - required
The transitions parameter requires an object that contains the transition states that create your custom animation. This transition object has 4 required key value pairs:

1. 'enter': **Object**
2. 'enter-active': **Object**
3. 'leave': **Object**
4. 'leave-active': **Object**

The keys define the transition state and the values are objects that describe the desired CSS properties of the component when that animation state has been completed.

#####Parameter - `customClassName` - type: STRING - optional
The customClassName parameter requires a string that gives your component a custom className property so that it can be accessed easily via CSS or jQuery etc.. This way when your component is converted to a ReactElement, it is still accessible via this customClassName property:

```
  <div class="zoom" data-reactid=".0.2.2.1.$=10:0"></div>
```

**Note:** All default animation components have a default class of the camelCase version of the animation name. Thus, Zoom has the className 'zoom' as in the example above, FadeDownBig has the className 'fadeDownBig', etc... However, even default class names can be overwritten via the customClassName parameter.

#####Parameter - `tagToRender` - type: STRING - optional
The createAnimation function wraps custom animation components in a ReactTransitionGroup in order to properly animate and this TransitionGroup renders in the DOM as span tag by default. The tagToRender parameter allows the TransitionGroup render with whatever tag you prefer. For example:

```
  createAnimation(Zoom, 'zoom', 'div');
```

In this implementation, the TransitionGroup that wraps our custom animation component would render in DOM as a div tag with a class of 'zoom'.

Now let's look at a complete implementation of the `createAnimation` function:

```
  var Zoom = {
    className: 'zoom',
    'enter': {
      'opacity': '0.01',
      'transform': 'scale(.1)',
      'transition-duration': '.5s',
      'transition-timing-function': 'linear'
    },
    'enter-active': {
      'opacity': '1',
      'transform': 'scale(1)'
    },
    'leave': {
      'opacity': '1',
      'transform': 'scale(1)',
      'transition-duration': '.5s',
      'transition-timing-function': 'linear'
    },
    'leave-active': {
      'opacity': '0.01',
      'transform': 'scale(.1)'
    }
  };

  Zoom = createAnimation(Zoom);
```

**Note:** This is a copy of the default zoom animation component.

#####Use Your Custom Animation Component
Just as with the default animation implementations, you can wrap whatever elements you wish to apply this custom animation to by nesting those elements within the component:

```
  <Zoom>
    <h1>Hello World</h1>
  </Zoom>
```

##Example #1
This example uses default Tux Animation components, all of the customizable properties, and implements a custom animation via the `createAnimation` function.

![Animation 3](http://cdn.makeagif.com/media/1-12-2015/uif2JH.gif)

```
  'use strict';

  var React = require('tux/React');
  var Fly = require('tux/Animations/Fly');
  var FadeUp = require('tux/Animations/Fade/Up');
  var FadeDown = require('tux/Animations/Fade/Up');

  //Custom Zoom transitions object
  var CustomZoom = {
    'enter': {
      'opacity': '0.01',
      'transform': 'scale(.1)',
      'transition-duration': '.5s',
      'transition-timing-function': 'linear'
    },
    'enter-active': {
      'opacity': '1',
      'transform': 'scale(1)'
    },
    'leave': {
      'opacity': '1',
      'transform': 'scale(1)',
      'transition-duration': '.5s',
      'transition-timing-function': 'linear'
    },
    'leave-active': {
      'opacity': '0.01',
      'transform': 'scale(.1)'
    }
  };

  //Make Custom Zoom Animation Component
  CustomZoom = createAnimation(Zoom, 'customZoom');

  //React component to render with animations
  var Home = React.createClass({
    render: function () {
      return (
        <div>
          <FadeDown duration={2000}>
            <h1>Hello World</h1>
          </FadeDown>
          <Fly delay="1s" easing="easeOutInBack" custom={{'font-size': '32px'}}>
            <h3>Tux Animations are so organized and classy</h3>
          </Fly>
          <CustomZoom delay={3000}>
            <p>I think Tux is my new favorite framework</p>
          </CustomZoom>
        </div>
      );  // end return
    }   //end render
  }); //end createClass
```
