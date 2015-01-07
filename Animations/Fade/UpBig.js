var makeAnimation = require('../Animation');
var objectAssign = require('object-assign');
var CommonAnimationProps = require('../CommonAnimationProps');
//Default FadeUpBig animation component
var FadeUpBig = {
  //Class name given to the animation component once mounted.
  className: 'fadeUpBig',
  //CSS for wrapped component on entry
  enter: objectAssign(CommonAnimationProps.enter, {
    'opacity': '0.01',
    'transform': 'translateY(200px)'
  }),
  //CSS for wrapped component when entry animation completes
  enterActive: {
    'opacity': '1',
    'transform': 'translateY(0)'
  },
  //CSS for wrapped component on leave
  leave: objectAssign(CommonAnimationProps.leave, {
    'opacity': '1',
    'transform': 'translateY(0)'
  }),
  //CSS for wrapped component when leave animation completes
  leaveActive: {
    'opacity': '0.01',
    'transform': 'translateY(200px)'
  }
};
//Use makeAnimation function from main Tux Animation module to create wrapping animation componenet and pass in the default params
module.exports = makeAnimation(FadeUpBig);
