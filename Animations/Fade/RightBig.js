'use strict';

var createAnimation = require('tux/Animations').createAnimation;
var assign = require('object-assign');
var CommonOpacityProps = require('tux/Animations/CommonOpacityProps');
//Default FadeRight animation component
var FadeRightBig = {
  //Class name given to the animation component once mounted
  className: 'fadeRightBig',
  //CSS for wrapped component on entry
  enter: assign({}, CommonOpacityProps.enter, {
    'transform': 'translateX(200px)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign({}, CommonOpacityProps['enter-active'], {
    'transform': 'translateX(0)'
  }),
  //CSS for wrapped component on leave
  leave: assign({}, CommonOpacityProps.leave, {
    'transform': 'translateX(0)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign({}, CommonOpacityProps['leave-active'], {
    'transform': 'translateX(200px)'
  })
};
//Use createAnimation function from main Tux Animation module to create wrapping animation component and pass in the default params
module.exports = createAnimation(FadeRightBig);
