var makeAnimation = require('../Animation');
//Default FadeUp animation component
var FadeUp = {
  //Class name given to the animation component once mounted.
  className: 'fadeUp',
  //CSS for wrapped component on entry
  enter: {
    'opacity': '0.01',
    'transform': 'translateY(20px)',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when entry animation completes
  enterActive: {
    'opacity': '1',
    'transform': 'translateY(0)'
  },
  //CSS for wrapped component on leave
  leave: {
    'opacity': '1',
    'transform': 'translateY(0)',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when leave animation completes
  leaveActive: {
    'opacity': '0.01',
    'transform': 'translateY(20px)'
  }
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation componenet and pass in the default params
module.exports = makeAnimation('FadeUp', FadeUp);
