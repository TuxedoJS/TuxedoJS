var makeAnimation = require('../src/TuxAnimations');
var assign = require('object-assign');
var CommonFadeProps = require('./Fade/CommonFadeProps');
var CommonAnimationProps = require('./CommonAnimationProps');
//Default Zoom animation component
var Zoom = {
  //Class name given to the animation component once mounted
  className: 'zoom',
  //CSS for wrapped component on entry
  enter: assign(CommonFadeProps.enter, {
    'transform': 'scale(.1)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign(CommonFadeProps['enter-active'], {
    'transform': 'scale(1)'
  }),
  //CSS for wrapped component on leave
  leave: assign(CommonFadeProps.leave, {
    'transform': 'scale(1)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign(CommonFadeProps['leave-active'], {
    'transform': 'scale(.1)'
  })
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation component and pass in the default params
module.exports = makeAnimation(Zoom);
