'use strict';

var createAnimation = require('tuxx/Animations').createAnimation;
var assign = require('object-assign');
var CommonOpacityProps = require('tuxx/Animations/CommonOpacityProps');
//Default Fade animation component
var Fade = {
  //Class name given to the animation component once mounted
  className: 'fade',
  //CSS for wrapped component on entry
  enter: CommonOpacityProps.enter,
  //CSS for wrapped component when entry animation completes
  'enter-active': CommonOpacityProps['enter-active'],
  //CSS for wrapped component on leave
  leave: CommonOpacityProps.leave,
  //CSS for wrapped component when leave animation completes
  'leave-active': CommonOpacityProps['leave-active']
};
//Use createAnimation function from main Tuxx Animation module to create wrapping animation component and pass in the default params
module.exports = createAnimation(Fade);
