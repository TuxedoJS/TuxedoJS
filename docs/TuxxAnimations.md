# Tuxx/Animations

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-Animations">Requiring Animations</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Require-what-you-need">Require only what you need</a></li>
        </ol>
      </li>
      <li><a href="#Rendering-Animations">Rendering Animations</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Specifying-an-animation-key">Specifying An Animation Key</a></li>
          <li><a href="#Default-Animations">Default Animations</a></li>
        </ol>
      </li>
      <li><a href="#Customize-Animation-Properties">Customize Animation Properties</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#animationProps-duration">PROPERTY: duration</a></li>
          <li><a href="#animationProps-delay">PROPERTY: delay</a></li>
          <li><a href="#animationProps-easing">PROPERTY: easing</a></li>
          <li><a href="#animationProps-vector">PROPERTY: vector</a></li>
          <li><a href="#animationProps-custom">PROPERTY: custom</a></li>
          <li><a href="#animationProps-enter">PROPERTY: enter</a></li>
          <li><a href="#animationProps-leave">PROPERTY: leave</a></li>
        </ol>
      </li>
      <li><a href="#Make-your-own-animation-components">Make Your Own Animation Components</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#customAnimationParams-transitions">PARAMETER: transitions</a></li>
          <li><a href="#customAnimationParams-customClassName">PARAMETER: customClassName</a></li>
          <li><a href="#customAnimationParams-tagToRender">PARAMETER: tagToRender</a></li>
          <li><a href="#use-your-custom-animation-component">Use Your Custom Animation Component</a></li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#Complete-Example">Complete Tuxx Animations Example</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>Tuxx Animations is a library of easy to use default animation components and easings. These default animations can also be customized via their properties. Additionally Tuxx Animations includes the `createAnimation` function which can be used to create custom animation components.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)

#### <a id="Requiring-Animations"></a>1) Requiring Animations Components [#](#Requiring-Animations)
The Tuxx Animations interface which allows creating custom animations can be exposed via:

```javascript
  var Animations = require('tuxx/Animations');
```

Requiring the top level animations module as illustrated above, will expose the [`createAnimation`](#Make-your-own-animation-components) function.

##### <a id="Require-what-you-need"></a>Require only what you need [#](#Require-what-you-need)
Tuxx is a modular framework and as such it is possible to require only the minimal number of files needed in order to save space in your app. For Example, if you need access to the default ScaleUp and FadeUp animations in your implementation, you need only to require those specific animations via:

```javascript
  var Fade = require('tuxx/Animations/Scale/Up');
  var FadeUp = require('tuxx/Animations/Fade/Up');
```

***

#### <a id="Rendering-Animations"></a>2) Rendering Animation Components [#](#Rendering-Animations)
The only other step to implementing a Tuxx animation is to wrap the element you want animated with the desired animation component within the render method of your `React.createClass` function.

```javascript
  render: function () {
    return (
      <Fade>
        <h1>Hello World</h1>
      </Fade>
    );
  }
```

![Animation 1](http://cdn.makeagif.com/media/2-07-2015/LxdwaO.gif)

##### <a id="Specifying-an-animation-key"></a>Specifying an Animation Key via the Id Property - type: STRING, ARRAY of STRINGs, or NUMBER - optional [#](#Specifying-an-animation-key)
Tuxx Animations work by concatenating the children of the animation into an array and wrapping that in a ReactTransitionGroup.  Because of that it is beneficial to provide the animation with an id property, which will tell it where to look in its children's `props` for a key to use.  If no id is provided the animations will still work as long as the children are not an array, but you will see warnings from React regarding the lack of a key.  You can specify a string or array of strings for the id property:

```javascript
  render: function () {
    var todo = {
      properties: {
        id: 1
      }
    };
    return (
      <Fade id='id'>
        <Todo todo={todo} />
      </Fade>
    );
  } //or to provide specificity

  render: function () {
    var todo = {
      properties: {
        id: 1
      }
    };
    return (
      <Fade id={['properties', 'id']}>
        <Todo todo={todo} />
      </Fade>
    );
  }
```

In every case the animation will use the value of the `id` property to find the `id` within the todo `props` and use that to assign it a key.  We highly recommend providing more specificity (the last case) as it will improve performance.  We use the id to deep search the element one time and then store the value for reuse later.  Thus, providing additional specificity will improve the performance of the one time deep search.  Note that when providing an array you do not need to provide every string in the hierarchy you want to search.

A numeric id can be specified, in which case all elements will receive that key.  Also, if there is only one element than it will automatically receive a key of 0.

**NOTE** that when we search for the id we always search within `props`.

```javascript
  render: function () {
    return (
      <Fade id={0}>
        <h1>Hello World</h1>
      </Fade>
    );
  } //or
  render: function () {
    return (
      <Fade>
        <h1>Hello World</h1>
      </Fade>
    );
  }
```

##### <a id="Default-Animations"></a>Default Animations [#](#Default-Animations)
In this implementation, the Fade component will inherit its default CSS transitions because no additional properties are defined. Each default animation component has its own default CSS transitions which you can view in the source code of the animation. To view all default animations, please visit the documentation under the `Tuxx/Animations` folder.

***

#### <a id="Customize-Animation-Properties"></a>3) Customize Default Animation Properties [#](#Customize-Animation-Properties)

Tuxx also allows easy customization of default animation components via their properties. Each animation component has 7 properties which are customizable and are completely optional.

1. Duration
2. Delay
3. Easing
4. Vector
5. Custom
6. Enter
7. Leave

##### <a id="animationProps-duration"></a>Duration Property - type: STRING or NUMBER - optional [#](#animationProps-duration)
The duration property, as the name would imply, determines the length of time for the animation sequence. Duration accepts a string with any standard CSS suffix or number input, but **beware** that numbers `will resolve in milliseconds`. The following two examples will both perform a 2 second long Fade animation:

```javascript
  <Fade duration="2s">
    <h1>Hello World</h1>
  </Fade>  //or
  <Fade duration={2000}>
    <h1>Hello World</h1>
  </Fade>
```

##### <a id="animationProps-delay"></a>Delay Property - type: STRING or NUMBER - optional [#](#animationProps-delay)
The delay property sets a delay on the animation before it activates. The delay property is similar to the duration property in that it accepts either a string or number input. The following example will add a 1 second delay to our animation:

```javascript
  <Fade duration={2000} delay={1000}>
    <h1>Hello World</h1>
  </Fade>
```

##### <a id="animationProps-easing"></a>Easing Property - type: STRING - optional [#](#animationProps-easing)
The easing property determines what motion path the animation takes when presented. Easing only accepts a string which can take any custom cubic bezier animation path you wish. For example:

```javascript
  <Fade duration={3000} delay={1000} easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)">
    <h1>Hello World</h1>
  </Fade>
```

The Easing property also accepts any of the Tuxx default easings as a string:

```javascript
  <Fade duration={3000} delay={1000} easing="easeInOutBack">
    <h1>Hello World</h1>
  </Fade>
```

The Tuxx default easings and their motion paths are illustrated below. The 'Linear' path is not shown, but it is purely a straight line motion path.

![Easings](http://i.imgur.com/2XAGQgq.png "Easings")

##### <a id="animationProps-vector"></a>Vector Property - type: OBJECT - optional - requires `Origin` & `Magnitude` [#](#animationProps-vector)
The vector property allows you set where your animation will orignate from and the magnitude of that entrance and exit to that origin. The vector property ccepts an object and expects two keys within that object: `origin` and `magnitude`. Magnitude accepts a number value and Origin accepts any single item of or any combination of two items from the the following list of acceptable origins:  'top', 'bottom', 'left' and 'right'. For example, if you wanted your elements to originate from the bottom right corner of the containing animation component with a magnitude of 50 pixels, it's as easy as:

```javascript
  <Fade duration={3000} delay={1000} easing="easeInOutBack" vector={{origin: 'bottom right', magnitude: 50}}>
    <h1>Hello World</h1>
  </Fade>
```


##### <a id="animationProps-custom"></a>Custom Property - type: OBJECT - optional [#](#animationProps-custom)
The custom property accepts an object as an input with any CSS properties you wish the elements within the animation component to transition to on enter. For example, if you wanted the element you've wrapped with a Fade animation component to also animate to the color red and increase its font size to 50px, it's as easy as:

```javascript
  <Fade duration={3000}
        delay={1000}
        easing="easeInOutBack"
        vector={{origin: 'bottom right', magnitude: 40}} custom={{'color': 'red'}}>
    <h1>Hello World</h1>
  </Fade>
```

**NOTE:** The CSS set in the custom property will overide the normal CSS of the elements nested within the animation componenet. Additionally, the CSS set in the custom property will transition back to the inhereted CSS on leave.

Let's see how the default Fade animation looks now that it has been customized via these 5 simple default properties:

![Animation 2](http://cdn.makeagif.com/media/2-07-2015/JfkPsC.gif)

##### <a id="animationProps-enter"></a>Enter Property - type: OBJECT - optional [#](#animationProps-enter)
The enter property allows you to completely custom how your animation will look upon entering the DOM. The enter property accepts an object as an input that can contain any of the 5 simple properties described above as keys with their corresponding accepted inputs as values.

```javascript
  <Fade enter={{duration:{3000}, delay:{1000}, easing:"easeInOutBack", vector:{origin: 'bottom right', magnitude: 50}, custom:{'color': 'red'}}>
    <h1>Hello World</h1>
  </Fade>
```

##### <a id="animationProps-leave"></a>Leave Property - type: OBJECT - optional [#](#animationProps-leave)
Similarly to the enter property, the leaving property allows you to completely custom how your animation will look upon leaving the DOM. The leave property accepts an object as an input that can contain any of the 5 simple properties described above as keys with their corresponding accepted inputs as values.

```javascript
  <Fade enter={{duration:3000,
                    delay:1000,
                    easing:"easeInOutBack",
                    vector:{origin: 'top right', magnitude: 20},
                    custom:{'color': 'red'}}}
            leave={{easing:"easeInOutBack",
                    vector:{origin: 'bottom right', magnitude: 30},
                    custom:{'color': 'blue'}}}>
    <h1>Hello World</h1>
  </Fade>
```

Finally, let's see how the default Fade animation looks now that it has been customized via the enter and leave properties:

![Animation 3](http://cdn.makeagif.com/media/2-07-2015/3DUe7L.gif)

***

#### <a id="Make-your-own-animation-components"></a>4) Make Your Own Animation Components [#](#Make-your-own-animation-components)
Requiring Tuxx Animations exposes a createAnimation function which allows the creation of custom animation components. The createAnimation function creates a custom component based on a passed in transition object and then wraps that custom component in a ReactTransitionGroup. The createAnimation function has one required parameter: `transitions` and two optional parameters: `customClassName` and `tagToRender`.

```javascript
  createAnimation(transitions, customClassName, tagToRender);
```

##### <a id="customAnimationParams-transitions"></a>Parameter - `transitions` - type: OBJECT - required [#](#customAnimationParams-transitions)
The transitions parameter requires an object that contains the transition states that create your custom animation. This transition object has 4 required key value pairs:

1. 'enter': **Object**
2. 'enter-active': **Object**
3. 'leave': **Object**
4. 'leave-active': **Object**

The keys define the transition state and the values are objects that describe the desired CSS properties of the component when that animation state has been completed.

##### <a id="customAnimationParams-customClassName"></a>Parameter - `customClassName` - type: STRING - optional [#](#customAnimationParams-customClassName)
The customClassName parameter requires a string that gives your component a custom className property so that it can be accessed easily via CSS or jQuery etc.. This way when your component is converted to a ReactElement, it is still accessible via this customClassName property:

```javascript
  <div class="Fade" data-reactid=".0.2.2.1.$=10:0"></div>
```

**Note:** All default animation components have a default class of the camelCase version of the animation name. Thus, Fade has the className 'fade' as in the example above, FadeDownBig has the className 'fadeDownBig', etc... However, even default class names can be overwritten via the customClassName parameter.

##### <a id="customAnimationParams-tagToRender"></a>Parameter - `tagToRender` - type: STRING - optional [#](#customAnimationParams-tagToRender)
The createAnimation function wraps custom animation components in a ReactTransitionGroup in order to properly animate and this TransitionGroup renders in the DOM as span tag by default. The tagToRender parameter allows the TransitionGroup render with whatever tag you prefer. For example:

```javascript
  createAnimation(Fade, 'fade', 'div');
```

In this implementation, the TransitionGroup that wraps our custom animation component would render in DOM as a div tag with a class of 'fade'.

Now let's look at a complete implementation of the `createAnimation` function:

```javascript
  var Custom = {
    className: 'custom',
    'enter': {
      'opacity': '0.01',
      'transition-duration': '1s',
      'transition-timing-function': 'linear'
    },
    'enter-active': {
      'opacity': '1',
    },
    'leave': {
      'opacity': '1',
      'transition-duration': '1s',
      'transition-timing-function': 'linear'
    },
    'leave-active': {
      'opacity': '0.01',
    }
  };

  Custom = createAnimation(Custom, 'custom', 'div');
```

**Note:** This is a copy of the default Fade animation component.

##### <a id="use-your-custom-animation-component"></a>Use Your Custom Animation Component [#](#use-your-custom-animation-component)
Just as with the default animation implementations, you can wrap whatever elements you wish to apply this custom animation to by nesting those elements within the component:

```javascript
  <Custom>
    <h1>Hello World</h1>
  </Custom>
```

***

## <a id="Complete-Example"></a>Complete Tuxx Animations Example [#](#Complete-Example)
This example uses default Tuxx Animation components, all of the customizable properties, and implements a custom animation via the `createAnimation` function.

![Animation 4](http://cdn.makeagif.com/media/2-07-2015/1pcUNj.gif)

```javascript
  'use strict';

  var React = require('tuxx/React');
  var Animations = require('tuxx/Animations');
  var ScaleUp = require('tuxx/Animations/Scale/Up');
  var FadeUp = require('tuxx/Animations/Fade/Up');
  var FadeDown = require('tuxx/Animations/Fade/Down');

  //Custom Scale transitions object
  var CustomScale = {
    'className': 'customScale',
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

  //Make Custom Scale Animation Component
  var CustomScale = Animations.createAnimation(CustomScale, 'customScale', 'div');

  //React component to render with animations
  var Home = React.createClass({
    render: function () {
      return (
        <div>
          <FadeDown duration={2000}>
            <h1>Hello World</h1>
          </FadeDown>
          <ScaleUp delay="1s" easing="easeInOutBack" custom={{'font-size': '32px'}}>
            <h3>Tuxx Animations are so organized and classy</h3>
          </ScaleUp>
          <CustomScale delay={3000} easing="easeInOutBack" vector={{origin: 'bottom right', magnitude: 50}}>
            <p>I think Tuxx is my new favorite framework</p>
          </CustomScale>
        </div>
      );  // end return
    }   //end render
  }); //end createClass
```
