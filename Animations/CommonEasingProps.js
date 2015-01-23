'use strict';

//Holds CSS properties which are shared among all animations with default transition linear easing
var CommonEasingProps = {
  enter: {
    'transition-timing-function': 'linear'
  },
  leave: {
    'transition-timing-function': 'linear'
  }
};

module.exports = CommonEasingProps;
