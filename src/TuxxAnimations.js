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
      //Change all custom props or add them if prop not defined in default
      for (var action in transitions) {
        if (action !== 'className') {
          var transition = transitions[action];
          for (var css in transition) {
            //Duration prop work-----------------------------------------
            var duration = this.props.duration;
            //Use default if no duration prop defined
            if (duration) {
              //Case to accept if duration prop is a number
              if (typeof duration === "number") {
                duration = duration + "ms";
              }
              transition['transition-duration'] = duration;
            }

            //Easing prop work-------------------------------------------
            var easing = this.props.easing;
            //Use default if no easing prop defined
            if (easing) {
              //Check to see if easing exists in default Easings object from the AnimationEasings module
              if (easing in Easings) {
                //Set easing to value of correpsonding key from Easings module object
                easing = Easings[easing];
              }
              transition['transition-timing-function'] =  easing;
            }

            //Delay prop work--------------------------------------------
            var delay = this.props.delay;
            //Use default if no delay prop defined
            if (delay) {
              //Case to accept if delay prop is a number
              if (typeof delay === "number") {
                delay = delay + "ms";
              }
              transition['transition-delay'] =  delay;
            }

            //Custom prop work-------------------------------------
            var custom = this.props.custom;
            if (custom) {
              var enter = transitions['enter-active'];
              var leave =transitions['enter-active'];
              for (var cssElement in custom) {
                var cssEl = custom[cssElement];
                enter[cssElement] =  cssEl;
                leave[cssElement] =  cssEl;
              }
            }
          }//End for css in transitions[action]
        }//End if action === className
      }//End for loop for transitions
    },

    componentWillEnter: function (callback) {
      this.setAnimationDomNode('enter', callback);
    },

    componentWillLeave: function (callback) {
      this.setAnimationDomNode('leave', callback);
    },

    render: function () {
      //Return new React.Dom element
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
    // Set toAnimate initial state as an array that wraps custom Animation component
    // *** toAnimate is an array because ReactTransitionGroup only accepts multiple elements if wrapped in a single array
    getInitialState: function () {
      return {
        toAnimate: []
      };
    },
    //Used to update toAnimate
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
      //Wrap each component in animation because ReactTransitionGroup only accepts one element. Store wrapped components in toAnimate
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

        //Pass in props to the Animation component
        return <Animation animate={el} duration={this.props.duration} delay={this.props.delay} easing={this.props.easing} custom={this.props.custom} key={key} />
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
  //Create class based on defined transitions
  var Animation = createAnimationClass(transitions, customClassName);
  //Wrap created class
  var AnimationGroup = createAnimationGroup(Animation, customClassName, tagToRender);
  //Return TransitionGroup wrapped animation class
  return AnimationGroup;
};

module.exports = createAnimation;
