var makeAnimation = require('../../src/TuxAnimations');
var assign = require('object-assign');
var CommonFadeProps = require('./CommonFadeProps');
//Default FadeLeftBig animation component
var FadeLeftBig = {
  //Class name given to the animation component once mounted
  className: 'fadeLeftBig',
  //CSS for wrapped component on entry
  enter: assign(CommonFadeProps.enter, {
    'transform': 'translateX(-200px)'
  }),
  //CSS for wrapped component when entry animation completes
  'enter-active': assign(CommonFadeProps['enter-active'], {
    'transform': 'translateX(0)'
  }),
  //CSS for wrapped component on leave
  leave: assign(CommonFadeProps.leave, {
    'transform': 'translateX(0)'
  }),
  //CSS for wrapped component when leave animation completes
  'leave-active': assign(CommonFadeProps['leave-active'], {
    'transform': 'translateX(-200px)'
  })
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation componenet and pass in the default params
module.exports = makeAnimation(FadeLeftBig);
