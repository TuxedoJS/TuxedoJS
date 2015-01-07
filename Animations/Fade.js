var makeAnimation = require('../src/TuxAnimations');
var assign = require('object-assign');
var CommonFadeProps = require('./Fade/CommonFadeProps');
//Default Fade animation component
var Fade = {
  //Class name given to the animation component once mounted
  className: 'fade',
  //CSS for wrapped component on entry
  enter: assign(CommonFadeProps.enter),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign(CommonFadeProps['enter-active']),
  //CSS for wrapped component on leave
  leave: assign(CommonFadeProps.leave),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign(CommonFadeProps['leave-active'])
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation component and pass in the default params
module.exports = makeAnimation(Fade);
