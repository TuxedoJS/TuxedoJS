var makeAnimation = require('./Animation');
//Defult Fade animation component
var Fade = {
  //Class name given to the animation component once mounted
  className: 'fade',
  //CSS for wrapped component on entry
  enter: {
    'opacity': '0.01',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when entry animation completes
  enterActive: {
    'opacity': '1'
  },
  //CSS for wrapped component on leave
  leave: {
    'opacity': '1',
    'transition-duration': '.5s',
    'transition-timing-function': 'linear'
  },
  //CSS for wrapped component when leave animation completes
  leaveActive: {
    'opacity': '0.01'
  }
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation componenet and pass in the default params
module.exports = makeAnimation(Fade);
