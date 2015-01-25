'use strict';

var assign = require('object-assign');
var CommonDurationProps = require('./CommonDurationProps');
var CommonEasingProps = require('./CommonEasingProps');

//Holds CSS properties which are shared among all animations with default opacity transitions
module.exports = {
  enter: assign({}, CommonEasingProps.enter, CommonDurationProps.enter, {
    'opacity': '0.01'
  }),
  'enter-active': {
    'opacity': '1'
  },
  leave: assign({}, CommonEasingProps.leave, CommonDurationProps.leave, {
    'opacity': '1'
  }),
  'leave-active': {
    'opacity': '0.01'
  }
};
