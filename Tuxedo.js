'use strict';

//NOTE: please avoid using this object if possible as it requires in all tux modules, even ones you might not use.  Please review the documentation on this subject and only require in your desired tux modules
var Tux = {};

//React object provides react module as well as opinionated tux react classes: createOwnerClass, createOwneeClass
//recommend accessing this object via require('tux/React')
Tux.React = require('./React');

//Stores object provides createStore method for creating stores
//recommend accessing this object via require('tux/Stores')
Tux.Stores = require('./Stores');

//Architecture object provides architect method for defining store relationships
//recommend accessing this object via require('tux/Architecture')
Tux.Architecture = require('./Architecture');

//Actions object provides means for creating and listening to actions
//recommend accessing this object via require('tux/Actions')
Tux.Actions = require('./Actions');

//Route object provides routing components
//recommend accessing a specific routing component via require('tux/Router/DESIRED ROUTING COMPONENT')
Tux.Router = require('react-router');

//Components object provides prebuilt react components
//recommend accessing a specific prebuilt component via require('tux/Components/DESIRED PREBUILT COMPONENT')
Tux.Components = {};

//Form
Tux.Components.Form = require('react-validating-form');

//Animations object provides react animation components and createAnimation method for creating custom animations
//recommend accessing a specific animation component via require('tux/Animations/DESIRED ANIMATION COMPONENT')
//recommend accessing a specific animation sub-component via require('tux/Animations/ANIMATION COMPONENT/ANIMATION SUB-COMPONENT')
//recommend accessing the createAnimation method via require('tux/Animations')
Tux.Animations = require('./Animations');

//Fade
Tux.Animations.Fade = require('./Animations/Fade');
Tux.Animations.Fade.Down = require('./Animations/Fade/Down');
Tux.Animations.Fade.DownBig = require('./Animations/Fade/DownBig');
Tux.Animations.Fade.Left = require('./Animations/Fade/Left');
Tux.Animations.Fade.LeftBig = require('./Animations/Fade/LeftBig');
Tux.Animations.Fade.Right = require('./Animations/Fade/Right');
Tux.Animations.Fade.RightBig = require('./Animations/Fade/RightBig');
Tux.Animations.Fade.Up = require('./Animations/Fade/Up');
Tux.Animations.Fade.UpBig = require('./Animations/Fade/UpBig');

//Zoom
Tux.Animations.Zoom = require('./Animations/Zoom');

//Fly
Tux.Animations.Fly = require('./Animations/Fly');

//Rotate
Tux.Animations.Rotate = require('./Animations/Rotate');
Tux.Animations.Rotate.ClockLeft = require('./Animations/Rotate/ClockLeft');
Tux.Animations.Rotate.ClockUp = require('./Animations/Rotate/ClockUp');
Tux.Animations.Rotate.CounterClock = require('./Animations/Rotate/CounterClock');
Tux.Animations.Rotate.CounterClockRight = require('./Animations/Rotate/CounterClockRight');
Tux.Animations.Rotate.CounterClockUp = require('./Animations/Rotate/CounterClockUp');

//warn user not to use this object in console
console.warn('Using the Tux object directly is not recommended as it will mean loading all modules even those you don\'t intend to use.  Please review the TuxedoJS documents for requiring only the individual pieces of TuxedoJS that you will need.');

module.exports = Tux;
