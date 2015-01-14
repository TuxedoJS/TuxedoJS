'use strict';

var createAnimation = require('tux/Animations').createAnimation;
var assign = require('object-assign');
var CommonOpacityProps = require('tux/Animations/CommonOpacityProps');

var CounterClockRight = {
  className: 'counterClockRight',
  //CSS for wrapped component on entry
  enter: assign({}, CommonOpacityProps.enter, {
    'transform': 'rotate(90deg)',
    'transformOrigin': 'right bottom'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign({}, CommonOpacityProps['enter-active'], {
    'transformOrigin': 'right bottom',
    'transform': 'rotate(0)'
  }),
  //CSS for wrapped component on leave
  leave: assign({}, CommonOpacityProps.leave, {
    'transformOrigin': 'right bottom',
    'transform': 'rotate(0)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign({}, CommonOpacityProps['leave-active'], {
    'transform': 'rotate(90deg)',
    'transformOrigin': 'right bottom'
  })
};
//Use createAnimation function from main Tux Animation module to create wrapping animation component and pass in the default params
module.exports = createAnimation(CounterClockRight);
