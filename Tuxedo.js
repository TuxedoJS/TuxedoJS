'use strict';

//NOTE: please avoid using this object if possible as it requires in all tuxx modules, even ones you might not use.  Please review the documentation on this subject and only require in your desired tux modules
var Tuxx = {};

//React object provides react module as well as opinionated tuxx react classes: createOwnerClass, createOwneeClass
//recommend accessing this object via require('tuxx/React')
Tuxx.React = require('./React');

//Stores object provides createStore method for creating stores
//recommend accessing this object via require('tuxx/Stores')
Tuxx.Stores = require('./Stores');

//Architecture object provides architect method for defining store relationships
//recommend accessing this object via require('tuxx/Architecture')
Tuxx.Architecture = require('./Architecture');

//Actions object provides means for creating and listening to actions
//recommend accessing this object via require('tuxx/Actions')
Tuxx.Actions = require('./Actions');

//Route object provides routing components
//recommend accessing a specific routing component via require('tuxx/Router/DESIRED ROUTING COMPONENT')
Tuxx.Router = require('react-router');

//Components object provides prebuilt react components
//recommend accessing a specific prebuilt component via require('tuxx/Components/DESIRED PREBUILT COMPONENT')
Tuxx.Components = {};

//Form
Tuxx.Components.Form = require('react-validating-form');

//Animations object provides react animation components and createAnimation method for creating custom animations
//recommend accessing a specific animation component via require('tuxx/Animations/DESIRED ANIMATION COMPONENT')
//recommend accessing a specific animation sub-component via require('tuxx/Animations/ANIMATION COMPONENT/ANIMATION SUB-COMPONENT')
//recommend accessing the createAnimation method via require('tuxx/Animations')
Tuxx.Animations = require('./Animations');

//Fade
Tuxx.Animations.Fade = require('./Animations/Fade');
Tuxx.Animations.Fade.Down = require('./Animations/Fade/Down');
Tuxx.Animations.Fade.DownBig = require('./Animations/Fade/DownBig');
Tuxx.Animations.Fade.Left = require('./Animations/Fade/Left');
Tuxx.Animations.Fade.LeftBig = require('./Animations/Fade/LeftBig');
Tuxx.Animations.Fade.Right = require('./Animations/Fade/Right');
Tuxx.Animations.Fade.RightBig = require('./Animations/Fade/RightBig');
Tuxx.Animations.Fade.Up = require('./Animations/Fade/Up');
Tuxx.Animations.Fade.UpBig = require('./Animations/Fade/UpBig');

//Zoom
Tuxx.Animations.Zoom = require('./Animations/Zoom');

//Fly
Tuxx.Animations.Fly = require('./Animations/Fly');

//Rotate
Tuxx.Animations.Rotate = require('./Animations/Rotate');
Tuxx.Animations.Rotate.ClockLeft = require('./Animations/Rotate/ClockLeft');
Tuxx.Animations.Rotate.ClockUp = require('./Animations/Rotate/ClockUp');
Tuxx.Animations.Rotate.CounterClock = require('./Animations/Rotate/CounterClock');
Tuxx.Animations.Rotate.CounterClockRight = require('./Animations/Rotate/CounterClockRight');
Tuxx.Animations.Rotate.CounterClockUp = require('./Animations/Rotate/CounterClockUp');

//warn user not to use this object in console
console.warn('Using the Tuxx object directly is not recommended as it will mean loading all modules even those you don\'t intend to use.  Please review the TuxedoJS documents for requiring only the individual pieces of TuxedoJS that you will need.');

module.exports = Tuxx;
