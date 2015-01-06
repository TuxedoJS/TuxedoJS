var Animation = require('../Animations.js');
//Default ZoomUpBig animation component
var ZoomUpBig = {
  //CSS for wrapped component on entry
  enter: {
    'opacity': '0.01',
    'transform': 'scale(.1) translateY(2000px)',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when entry animation completes
  enterActive: {
    'opacity': '1',
    'transform': 'scale(1) translateY(0)'
  },
  //CSS for wrapped component on leave
  leave: {
    'opacity': '1',
    'transform': 'scale(1) translateY(0)',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when leave animation completes
  leaveActive: {
    'opacity': '0.01',
    'transform': 'scale(.1) translateY(2000px)'
  }
};
//Use makeTransition function from main Tux Animation module to create wrapping animation componenet and pass in the default params
module.exports = Animation.makeTransition('ZoomUpBig', ZoomUpBig);
