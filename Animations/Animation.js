'use strict';

var React = require("react/addons");
var Arrival = require('Arrival');
var Easings = require("./AnimationEasings.js");
var ReactTransitionGroup = React.addons.TransitionGroup;

//makeTransition FUNCTION: creates animation for wrapped component based on props of wrapper component
  //@param displayName STRING: intended name of the wrapper animation component
  //@param transitions OBJECT: properties that define the default animation properties for the animation component wrapper
var makeTransition = function (displayName, transitions) {

  // setAnimationDomNode FUNCTION: function to handle manipulating and setting a TransitionGroup in the DOM.
    //@param mount STRING: the transition key you are looking to affect
    //@param callback FUNCTION: callback attribute passed in from the containing function to act on function completion.
  var setAnimationDomNode = function (mount, callback) {
      this.el = this.getDOMNode();
      this.$el = $(this.el);

      // requestAnimationFrame FUNCTION: Calls the specified function updating an animation before the next browser repaint. Defined in window.
      requestAnimationFrame(function () {
        this.$el.css(transitions[mount]);
        requestAnimationFrame(function () {
          this.$el.css(transitions[mount + 'Active']);
          Arrival(this.$el, callback);
        }.bind(this));
      }.bind(this));
  };

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
    componentWillEnter: function (callback) {
      setAnimationDomNode('enter', callback);
    },

    componentDidEnter: function () {
      // This is called after the callback function that was passed to componentWillEnter is called.
    },

    componentWillLeave: function (callback) {
      setAnimationDomNode('leave', callback);
    },

    componentDidLeave: function () {
      //This is called when the willLeave callback is called (at the same time as componentWillUnmount).
    },

    render: function () {
      //Change all custom props or add them if prop not defined in default
      for (var action in transitions) {
        for (var css in transitions[action]) {

          //Duration prop work-----------------------------------------
          var duration = this.props.duration;
          //Use default if no duration prop defined
          if (duration) {
            //Case to accept if duration prop is a number
            if (typeof duration === "number") {
              duration = duration + "ms"
            }
            transitions[action]['transition-duration'] = duration;
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
            transitions[action]['transition-timing-function'] =  easing;
          }

          //Delay prop work--------------------------------------------
          var delay = this.props.delay;
          //Use default if no delay prop defined
          if (delay) {
            //Case to accept if delay prop is a number
            if (typeof delay === "number") {
              delay = delay + "ms"
            }
            transitions[action]['transition-delay'] =  delay;
          }

          //Custom properties work-------------------------------------
          var custom = this.props.custom;
          if (custom) {
            for (var cssElement in custom) {
              transitions['enterActive'][cssElement] =  custom[cssElement];
              transitions['leave'][cssElement] =  custom[cssElement];
            }
          }
        }
      }//End for loop for transitions

      //Return new React.Dom element
      return (
        React.DOM.div(
          {
            className: displayName,
            key: this.props.key
          },
           this.props.children
        )
      )
    }
   });
};

module.exports = makeTransition;
