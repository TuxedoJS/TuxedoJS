'use strict';

var createAnimation = require('tuxx/Animations').createAnimation;
var assign = require('object-assign');
var CommonOpacityProps = require('tuxx/Animations/CommonOpacityProps');
//Default Fly animation component
var Fly = {
  //Class name given to the animation component once mounted
  className: 'fly',
  //CSS for wrapped component on entry
  enter: assign({}, CommonOpacityProps.enter, {
    'transform': 'translateY(-2000px)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign({}, CommonOpacityProps['enter-active'], {
    'transform': 'translateY(0px)'
  }),
  //CSS for wrapped component on leave
  leave: assign({}, CommonOpacityProps.leave, {
    'transform': 'translateY(0px)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign({}, CommonOpacityProps['leave-active'], {
    'transform': 'translateY(-2000px)'
  })
};
//Use createAnimation function from main Tuxx Animation module to create wrapping animation component and pass in the default params
module.exports = createAnimation(Fly);
