var makeAnimation = require('../src/TuxAnimations');
var assign = require('object-assign');
var CommonFadeProps = require('./Fade/CommonFadeProps');
var CommonAnimationProps = require('./CommonAnimationProps');
//Default Fly animation component
var Fly = {
  //Class name given to the animation component once mounted
  className: 'fly',
  //CSS for wrapped component on entry
  enter: assign(CommonFadeProps.enter, {
    'transform': 'translateY(-2000px)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign(CommonFadeProps['enter-active'], {
    'transform': 'translateY(0px)'
  }),
  //CSS for wrapped component on leave
  leave: assign(CommonAnimationProps.leave, {
    'transform': 'translateY(0px)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': {
    'opacity': '1',
    'transform': 'translateY(-2000px)'
  }
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation component and pass in the default params
module.exports = makeAnimation(Fly);
