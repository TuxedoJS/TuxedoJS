'use strict';

var React = require('tuxx/React');
var Arrival = require('arrival');
var Easings = require('tuxx/src/TuxxAnimationEasings');
var deepSearch = require('tuxx/src/TuxxDeepSearch');
var ReactTransitionGroup = require('tuxx/React/TransitionGroup');

//createAnimationClass FUNCTION: creates an animationClass which will animate based on the passed in transitions object
  //@param transitions OBJECT: properties that define the default animation properties for the animation component wrapper
  //@param customClassName STRING: sets className prop of created component
var createAnimationClass = function (transitions, customClassName) {
  console.log(transitions);
  //If a second parameter is passed in as the desired class name for the animation, set this as className, othewise, use the animation's default class name
  var className;
  if (customClassName) {
    className = customClassName;
  } else {
    className = transitions.className;
  }
  //React.createClass FUNCTION: function to create animation component class
    //@param OBJECT: componentMounting and render
    //Required keys:
      // render FUNCTION: since this is an implementation of React.createClass a render method is required
      // componentWillEnter FUNCTION: required for animation entering
      // componentWillLeave FUNCTION: required for animation leaving
    //Additional keys
      // componentDidEnter FUNCTION: use to define actions to run after an animation has entry completed
      // componentDidLeave FUNCTION: use to define actions to run after an animation has leave completed
  return React.createClass({
    // setAnimationDomNode FUNCTION: function to handle manipulating and setting a TransitionGroup in the DOM
      //@param action STRING: the transition key you are looking to affect
      //@param callback FUNCTION: callback attribute passed in from the containing function to act on function completion
    setAnimationDomNode: function (action, callback) {
      var componentToAnimate = this.getDOMNode();
      var startingAction = transitions[action];
      var endingAction = transitions[action + '-active'];
      // requestAnimationFrame FUNCTION: Calls the specified function updating an animation before the next browser repaint. Defined in window
      window.requestAnimationFrame(function () {
        for (var key in startingAction) {
          componentToAnimate.style[key] = startingAction[key];
        }
        window.requestAnimationFrame(function () {
          for (var key in endingAction) {
            componentToAnimate.style[key] = endingAction[key];
          }
          Arrival(componentToAnimate, callback);
        }.bind(this));
      }.bind(this));
    },

    componentWillMount: function () {
      //set enter and leave props
      var enterProps = this.props.enter;
      var leaveProps = this.props.leave;

      //iterate over each transtion state and set props or overwrite defaults
      for (var action in transitions) {

        if (action !== 'className') {
          //set transition states
          var enter = transitions['enter'];
          var enterActive = transitions['enter-active'];
          var leave = transitions['leave'];
          var leaveActive = transitions['leave-active'];

          //duration prop work-----------------------------------------
          var duration = this.props.duration;
          //use default if no duration prop defined
          if (duration) {
            //case to accept if duration prop is a number
            if (typeof duration === "number") {
              duration = duration + "ms";
            }
            enter['transition-duration'] = duration;
            enterActive['transition-duration'] = duration;
            leave['transition-duration'] = duration;
            leaveActive['transition-duration'] = duration;
          }
          if (enterProps) {
            if (typeof enterProps.duration === "number") {
              enterProps.duration = enterProps.duration + "ms";
            }
            enter['transition-duration'] = enterProps.duration;
            enterActive['transition-duration'] = enterProps.duration;
          }
          if (leaveProps) {
            if (typeof leaveProps.duration === "number") {
              leaveProps.duration = leaveProps.duration + "ms";
            }
            leave['transition-duration'] = leaveProps.duration;
            leaveActive['transition-duration'] = leaveProps.duration;
          }

          //easing prop work-------------------------------------------
          var easing = this.props.easing;
          //use default if no easing prop defined
          if (easing) {
            //check to see if easing exists in default Easings object from the AnimationEasings module
            if (Easings[easing]) {
              //set easing to value of correpsonding key from Easings module object
              easing = Easings[easing];
              enter['transition-timing-function'] = easing;
              enterActive['transition-timing-function'] = easing;
              leave['transition-timing-function'] = easing;
              leaveActive['transition-timing-function'] = easing;
            } else {
              throw 'easing: not of acceptable type. Check the TuxxAnimationEasings file for a list of accepted easings or use a cubic bezier input.'
            }
          }
          if (enterProps) {
            //check to see if easing exists in default Easings object from the AnimationEasings module
            if (Easings[enterProps.easing]) {
              //set easing to value of correpsonding key from Easings module object
              enter['transition-timing-function'] =  Easings[enterProps.easing];
              enterActive['transition-timing-function'] = Easings[enterProps.easing];
            } else {
              throw 'easing: not of acceptable type. Check the TuxxAnimationEasings file for a list of accepted easings or use a cubic bezier input.'
            }
          }
          if (leaveProps) {
            //check to see if easing exists in default Easings object from the AnimationEasings module
            if (Easings[leaveProps.easing]) {
              //set easing to value of correpsonding key from Easings module object
              leave['transition-timing-function'] = Easings[leaveProps.easing];
              leaveActive['transition-timing-function'] = Easings[leaveProps.easing];
            } else {
              throw 'easing: not of acceptable type. Check the TuxxAnimationEasings file for a list of accepted easings or use a cubic bezier input.'
            }
          }

          //delay prop work--------------------------------------------
          var delay = this.props.delay;
          //use default if no delay prop defined
          if (delay) {
            //case to accept if delay prop is a number
            if (typeof delay === "number") {
              delay = delay + "ms";
            }
            enter['transition-delay'] =  delay;
            enterActive['transition-delay'] =  delay;
            leave['transition-delay'] =  delay;
            leaveActive['transition-delay'] =  delay;
          }
          if (enterProps) {
            //case to accept if enterProps.delay prop is a number
            if (typeof enterProps.delay === "number") {
              enterProps.delay = enterProps.delay + "ms";
            }
            enter['transition-delay'] =  enterProps.delay;
            enterActive['transition-delay'] = enterProps.delay;
          }
          if (leaveProps) {
            //case to accept if leaveProps.delay prop is a number
            if (typeof leaveProps.delay === "number") {
              leaveProps.delay = leaveProps.delay + "ms";
            }
            leave['transition-delay'] = leaveProps.delay;
            leaveActive['transition-delay'] = leaveProps.delay;
          }

          //vector prop work--------------------------------------------
          //vector property takes an object consisting of origin and magnitude

          //origin prop work--------------------------------------------
          var origin = this.props.origin
          //check if origin is an accepted origin or throw error
          var AcceptedOrigins = ['top','right','bottom','left','center','center center','top left','top center','top right','right center','bottom right','bottom center','bottom left', 'left center']
          if (origin) {
            if (AcceptedOrigins.indexOf(origin) > -1) {
              enter['transform-origin'] = origin;
              enterActive['transform-origin'] = origin;
              leave['transform-origin'] = origin;
              leaveActive['transform-origin'] = origin;
            } else {
              throw "origin type: animation origin property is not of acceptable type. List of acceptable origins: 'center center','top left','top center','top right','right center','bottom right','bottom center','bottom left', 'left center'";
            }
          }
          if (enterProps) {
            if (AcceptedOrigins.indexOf(enterProps.vector.origin) > -1) {
              enter['transform-origin'] = enterProps.vector.origin;
              enterActive['transform-origin'] = enterProps.vector.origin;
            } else {
              throw "origin type: animation origin property is not of acceptable type. List of acceptable origins: 'center center','top left','top center','top right','right center','bottom right','bottom center','bottom left', 'left center'";
            }
          }
          if (leaveProps) {
            if (AcceptedOrigins.indexOf(leaveProps.vector.origin) > -1) {
              leave['transform-origin'] = leaveProps.vector.origin;
              leaveActive['transform-origin'] = leaveProps.vector.origin;
            } else {
              throw "origin type: animation origin property is not of acceptable type. List of acceptable origins: 'center center','top left','top center','top right','right center','bottom right','bottom center','bottom left', 'left center'";
            }
          }

          //magnitude prop work--------------------------------------------
          //setMagnitude function
          var setMagnitude = function (originType, origin, magnitude) {
            //set transform prop in all transition states to empty string so as to concat translate animations
            enter['transform'] = enter['transform'] || '';
            enterActive['transform'] = enterActive['transform'] || '';
            leave['transform'] = leave['transform'] || '';
            leaveActive['transform'] = leaveActive['transform'] || '';

            if (!origin) {
              throw 'origin reference: the magnitude property requires an origin property to be set in order to function'
            }
            //case to accept if Magnitude prop is a number
            if (typeof magnitude === "number") {
              //setOrigin function
              var setOrigin = function (origin, originMatch) {
                if (origin) {
                  if (origin.indexOf(originMatch) > -1) {
                    return true;
                  }
                }
              }
              //if origin is any corner, divide magnitude in half
              if (originType.length > 6) {
                magnitude = magnitude / 2;
              }

              if (originType === 'origin') {
                //if origin contains 'top' then apply negative magnitude to translateY
                if (setOrigin(origin,'top')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateY(-' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateY(0px)');
                  leave['transform'] = leave['transform'].concat(' translateY(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateY(-' + magnitude.toString() + 'px)');
                }
                //if origin contains 'right' then apply positive magnitude to translateX
                if (setOrigin(origin,'right')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateX(' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateX(0px)');
                  leave['transform'] = leave['transform'].concat(' translateX(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateX(' + magnitude.toString() + 'px)');
                }
                //if origin contains 'bottom' then apply positive magnitude to translateY
                if (setOrigin(origin,'bottom')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateY(' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateY(0px)');
                  leave['transform'] = leave['transform'].concat(' translateY(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateY(' + magnitude.toString() + 'px)');
                }
                //if origin contains 'left' then apply negative magnitude to translateX
                if (setOrigin(origin,'left')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateX(-' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateX(0px)');
                  leave['transform'] = leave['transform'].concat(' translateX(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateX(-' + magnitude.toString() + 'px)');
                }
              }//end origin

              if (originType === 'enter') {
                //if enterProps.vector.origin contains 'top' then apply negative magnitude to translateY
                if (setOrigin(origin,'top')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateY(-' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateY(0px)');
                }
                //if origin contains 'right' then apply positive magnitude to translateX
                if (setOrigin(origin,'right')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateX(' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateX(0px)');
                }
                //if origin contains 'bottom' then apply positive magnitude to translateY
                if (setOrigin(origin,'bottom')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateY(' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateY(0px)');
                }
                //if origin contains 'left' then apply negative magnitude to translateX
                if (setOrigin(origin,'left')) {
                  //set transfrom properties
                  enter['transform'] = enter['transform'].concat(' translateX(-' + magnitude.toString() + 'px)');
                  enterActive['transform'] = enterActive['transform'].concat(' translateX(0px)');
                }
              }//end enterProps.vector.origin

              if (originType === 'leave') {
                //if enterProps.vector.origin contains 'top' then apply negative magnitude to translateY
                if (setOrigin(origin,'top')) {
                  //set transfrom properties
                  leave['transform'] = leave['transform'].concat(' translateY(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateY(-' + magnitude.toString() + 'px)');
                }
                //if origin contains 'right' then apply positive magnitude to translateX
                if (setOrigin(origin,'right')) {
                  //set transfrom properties
                  leave['transform'] = leave['transform'].concat(' translateX(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateX(' + magnitude.toString() + 'px)');
                }
                //if origin contains 'bottom' then apply positive magnitude to translateY
                if (setOrigin(origin,'bottom')) {
                  //set transfrom properties
                  leave['transform'] = leave['transform'].concat(' translateY(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateY(' + magnitude.toString() + 'px)');
                }
                //if origin contains 'left' then apply negative magnitude to translateX
                if (setOrigin(origin,'left')) {
                  //set transfrom properties
                  leave['transform'] = leave['transform'].concat(' translateX(0px)');
                  leaveActive['transform'] = leaveActive['transform'].concat(' translateX(-' + magnitude.toString() + 'px)');
                }
              }//end leaveProps.vector.origin
            } else {
              throw 'magnitude property error: magnitude prop must have a number input written as {number}';
            }//end if type is number
          }//end setMagnitude function

          //call setMagnitude
          var vector = this.props.vector;
          if (vector) {
            setMagnitude('origin', vector.origin, vector.magnitude);
          }
          if (enterProps) {
            setMagnitude('enter', enterProps.vector.origin, enterProps.vector.magnitude);
          }
          if (leaveProps) {
            setMagnitude('leave', leaveProps.vector.origin, leaveProps.vector.magnitude);
          }//end magnitude work

          //custom prop work-------------------------------------
          var custom = this.props.custom;

          if (custom) {
            //iterate over css set in custom prop
            for (var cssElement in custom) {
              var cssEl = custom[cssElement];
              //add transition of custom props on entrance and transtion out custom css on leave
              enter[cssElement] = 'inherit';
              enterActive[cssElement] = cssEl;
              leave[cssElement] = cssEl;
              leaveActive[cssElement] = 'inherit';
            }
          }
          if (enterProps) {
            for (var cssElement in enterProps.custom) {
              //add transition from custom props on entrance
              var cssEl = enterProps.custom[cssElement];
              enter[cssElement] = cssEl;
              //set up override on enter by custom prop if also defined
              if (custom) {
                enterActive[cssElement] = custom[cssElement];
              } else {
                enterActive[cssElement] = 'inherit';
              }
            }
          }
          if (leaveProps) {
            for (var cssElement in leaveProps.custom) {
              //add transition to custom props on leave
              var cssEl = leaveProps.custom[cssElement];
              //set up override on leave by custom prop if also defined
              if (custom) {
                leave[cssElement] = custom[cssElement];
              } else {
                leave[cssElement] = 'inherit';
              }
              leaveActive[cssElement] = cssEl;
            }
          }
        }//end if action === className
      }//end for loop for transitions
    },

    componentWillEnter: function (callback) {
      this.setAnimationDomNode('enter', callback);
    },

    componentWillLeave: function (callback) {
      this.setAnimationDomNode('leave', callback);
    },

    render: function () {
      //return new React.Dom element
      return (
        React.DOM.div(
          {
            className: className
          },
          this.props.animate
        )
      );
    }
   });
};

// createAnimationGroup FUNCTION: wraps custom animation class
  // @param Animation OBJECT: animation class based on custom properties
  // @param customClassName STRING: className to apply to AnimationGroup
  // @param tagToRender STRING: what tag the animationGroup will render as in the DOM - defaults to span
var createAnimationGroup = function (Animation, customClassName, tagToRender) {

  tagToRender = tagToRender || 'span';

  //React.createClass FUNCTION: function to create animation component
    //@param OBJECT: component setState, props, and render
  return React.createClass({
    // set toAnimate initial state as an array that wraps custom Animation component
    // *** toAnimate is an array because ReactTransitionGroup only accepts multiple elements if wrapped in a single array
    getInitialState: function () {
      return {
        toAnimate: []
      };
    },
    //used to update toAnimate
    componentWillReceiveProps: function (newProps) {
      this.setState({
        toAnimate: [].concat(newProps.children)
      });
    },

    render: function () {
      //store this.props.id
      var id = this.props.id;
      //store toAnimate length
      var stateToAnimateLength = this.state.toAnimate.length;
      //wrap each component in animation because ReactTransitionGroup only accepts one element. Store wrapped components in toAnimate
      var toAnimate = this.state.toAnimate.map(function (el) {
        var key;
        //check if id is a string or an array
        if (typeof id === 'string' || Array.isArray(id)) {
          //check if __tuxxAnimationKey__ is defined, If it is not than build it out using deepSearch
          var __tuxxAnimationKey__ = this.__tuxxAnimationKey__;
          if (!__tuxxAnimationKey__) {
            //search through props of the element for the id
            __tuxxAnimationKey__ = deepSearch(id, el.props, 'props');
            //store the result at the key of __tuxxnimationKey__
            this.__tuxxAnimationKey__ = __tuxxAnimationKey__;
          }
          //iterate through __tuxxAnimationKey__ to find key property in el
          var tuxxAnimationKeyLength = __tuxxAnimationKey__.length;
          //start with el and search down from there
          key = el;
          for (var i = 0; i < tuxxAnimationKeyLength; i++) {
            key = key[__tuxxAnimationKey__[i]];
          }

        //else if id is a number then set key equal to that
        } else if (typeof id === 'number') {
          key = id;

        //else if stateToAnimate is one element then set the key value to 0
        } else if (stateToAnimateLength) {
          key = 0;
        }

        //pass in props to the Animation component
        return <Animation animate={el} enter={this.props.enter} leave={this.props.leave} duration={this.props.duration} delay={this.props.delay} easing={this.props.easing} vector={this.props.vector} custom={this.props.custom} key={key} />
      }.bind(this));

      return (
        <ReactTransitionGroup className={customClassName} component={tagToRender}>
          {toAnimate}
        </ReactTransitionGroup>
      );
    }
  });
};

// createAnimation FUNCTION: creates animation by creating a custom class based on the passed in props and transitions and wraps that class in a React Transition Group via the createAnimationGroup function
  // @param transitions OBJECT: properties that define the default animation properties for the created animation class
  // @param customClassName STRING: defines className of animation class
  // @param tagToRender STRING: defines the type of tag the wrapping TransitionGroup will render as in the DOM
var createAnimation = function (transitions, customClassName, tagToRender) {
  //create class based on defined transitions
  var Animation = createAnimationClass(transitions, customClassName);
  //wrap created class
  var AnimationGroup = createAnimationGroup(Animation, customClassName, tagToRender);
  //return TransitionGroup wrapped animation class
  return AnimationGroup;
};


module.exports = createAnimation;
