// Transitions object holds all of the custom transitions.
var transitions = {};

// Fade transitions elements by fading in entering elements and fading out exiting elements.
transitions.fade = {
  enter: {
      'opacity':' 0.01',
      'transition': 'opacity .5s ease-in'
  },
  enterActive: {
    'opacity': '1'
  },
  leave: {
    'opacity': '1',
    'transition': 'opacity .5s ease-in'
  },
  leaveActive: {
    'opacity': '0.01'
  }
};

// Fly transitions elements down the page when entering and up the page when exiting.
transitions.fly = {
  enter: {
  'opacity':'0.01',
  'transform': 'translateY(-2000px)',
  'transition': 'transform 1s ease-in'
  },
  enterActive: {
    'opacity': '1',
    'transform': 'translateY(0px)'
  },
  leave: {
    'transform': 'translateY(0px)',
    'transition': 'transform 1s ease-in'
  },
  leaveActive: {
    'opacity': '1',
    'transform': 'translateY(-2000px)'
  }
};

// Exports our transitions object to be used by our animation constructor.
module.exports = transitions;
