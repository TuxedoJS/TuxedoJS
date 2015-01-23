'use strict';

var createAnimation = require('tuxx/Animations').createAnimation;
var assign = require('object-assign');
var CommonOpacityProps = require('tuxx/Animations/CommonOpacityProps');
//Default Down animation component
var ScaleDown = {
  //Class name given to the animation component once mounted
  className: 'scaleDown',
  //CSS for wrapped component on entry
  enter: assign({}, CommonOpacityProps.enter, {
    'transform': 'scale(1.5)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign({}, CommonOpacityProps['enter-active'], {
    'transform': 'scale(1)'
  }),
  //CSS for wrapped component on leave
  leave: assign({}, CommonOpacityProps.leave, {
    'transform': 'scale(1)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign({}, CommonOpacityProps['leave-active'], {
    'transform': 'scale(1.5)'
  })
};
//Use createAnimation function from main Tuxx Animation module to create wrapping animation component and pass in the default params
module.exports = createAnimation(ScaleDown);
