'use strict';

var assign = require('object-assign');
var CommonAnimationProps = require('./CommonAnimationProps');

//Holds CSS properties which are shared among all Fade animations
var CommonOpacityProps = {
  enter: assign({}, CommonAnimationProps.enter, {
    'opacity': '0.01'
  }),
  'enter-active': {
    'opacity': '1'
  },
  leave: assign({}, CommonAnimationProps.leave, {
    'opacity': '1'
  }),
  'leave-active': {
    'opacity': '0.01'
  }
};

module.exports = CommonOpacityProps;
