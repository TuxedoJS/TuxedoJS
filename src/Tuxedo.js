'use strict';

var React = require('react');

var Flux = require('flux');

var Tux = Object.create(React);
Tux.Dispatcher = Flux.Dispatcher;

Tux.createStore = require('./TuxStore');
Tux.architect = require('./TuxArchitectStores');

//Tux React
Tux.createOwnerClass = require('./src/TuxOwnerClass');
Tux.createOwneeClass = require('./src/TuxOwneeClass');

//Tux Components
Tux.Components = {};
Tux.Components.Form = require('react-validating-form');
Tux.Components.Router = require('react-router');

//Tux Actions
Tux.Actions = require('./TuxActions');
Tux.createActionCategory = Tux.Actions.createActionCategory;

//Tux Animations
Tux.Animations = {};
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
Tux.Animations.Zoom.Down = require('./Animations/Zoom/Down');
Tux.Animations.Zoom.DownBig = require('./Animations/Zoom/DownBig');
Tux.Animations.Zoom.Left = require('./Animations/Zoom/Left');
Tux.Animations.Zoom.LeftBig = require('./Animations/Zoom/LeftBig');
Tux.Animations.Zoom.Right = require('./Animations/Zoom/Right');
Tux.Animations.Zoom.RightBig = require('./Animations/Zoom/RightBig');
Tux.Animations.Zoom.Up = require('./Animations/Zoom/Up');
Tux.Animations.Zoom.UpBig = require('./Animations/Zoom/UpBig');
//Fly
Tux.Animations.Fly = require('./Animations/Fly');

module.exports = Tux;
