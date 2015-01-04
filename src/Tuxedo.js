'use strict';

var React = require('react');

var Flux = require('flux');
var TuxStore = require ('./TuxStore');

var Tux = Object.create(React);
Tux.Dispatcher = Flux.Dispatcher;
Tux.createStore = TuxStore;

//Tux React
Tux.createOwnerClass = require('./src/TuxOwnerClass');
Tux.createOwneeClass = require('./src/TuxOwneeClass');

//Tux Components
Tux.Components = {};
Tux.Components.Form = require('react-validating-form');
Tux.Components.Router = require('react-router');

//Tux actions
Tux.Actions = require('./TuxActions');
Tux.createActionCategory = Tux.Actions.createActionCategory;

module.exports = Tux;
