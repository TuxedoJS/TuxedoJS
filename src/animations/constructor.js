// Require react with addons to get access to React Transition Groups
var React = require("react/addons");

//Require arrival to know when elements and their children have transitionended.
var Arrival = require('Arrival');

// Creates an object that holds the React Transition Group Component
var ReactTransitionGroup = React.addons.TransitionGroup;

// Constructor function that can be invoked to create custom animation components.
var makeAnimation = function(displayName, transitions) {
  return React.createClass({
    componentWillEnter: function(done) {
      // This is called at the same time as componentDidMount() for components added to an existing TransitionGroup. It will block other animations from occurring until callback is called. It will not be called on the initial render of a TransitionGroup.
      this.el = this.getDOMNode();
      this.$el = $(this.el);

      // Calls the specified function to update an animation before the next browser repaint.
      requestAnimationFrame(function() {
        this.$el.css(transitions.enter);

        // Calls the specified function to update an animation before the next browser repaint.
        requestAnimationFrame(function() {
          this.$el.css(transitions.enterActive);

          // when this.$el finishes transitioning, invokes done callback
          Arrival(this.$el, done);
        }.bind(this));
      }.bind(this));
    },
    componentDidEnter: function() {
      // This is called after the callback function that was passed to componentWillEnter is called.
    },
    componentWillLeave: function(done) {
      // This is called after the callback function that was passed to componentWillEnter is called.
      this.el = this.getDOMNode();
      this.$el = $(this.el);

      requestAnimationFrame(function() {
        this.$el.css(transitions.leave);

        requestAnimationFrame(function() {
          this.$el.css(transitions.leaveActive);

          // when this.$el finishes transitioning, invokes done callback
          Arrival(this.$el, done);
        }.bind(this));
      }.bind(this));
    },
    componentDidLeave: function() {
      //This is called when the willLeave callback is called (at the same time as componentWillUnmount).
    },
    render: function() {
      return (
        React.DOM.div(
          {className: displayName, key: this.props.key},
          this.props.children
        )
      );
    }
   });
};

module.exports = makeAnimaton;
