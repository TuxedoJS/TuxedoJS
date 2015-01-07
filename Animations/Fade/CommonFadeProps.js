var CommonAnimationProps = require('../CommonAnimationProps');

//Holds CSS properties which are shared among all Fade animations
var CommonFadeProps = {
  enter: objectAssign(CommonAnimationProps.enter, {
    'opacity': '0.01'
  }),
  enterActive: {
    'opacity': '1'
  },
  leave: objectAssign(CommonAnimationProps.leave, {
    'opacity': '1'
  }),
  leaveActive: {
    'opacity': '0.01'
  }
};

module.exports = CommonFadeProps;
