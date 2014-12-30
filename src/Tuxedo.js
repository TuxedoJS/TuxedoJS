'use strict';

var React = require('react');

var Flux = require('flux');

var Tux = Object.create(React);
Tux.Dispatcher = Flux.Dispatcher;

//Tux Components
Tux.Components = {};
Tux.Components.Form = require('react-validating-form');
Tux.Components.Router = require('react-router');

//Tux actions
Tux.Actions = require('./TuxActions');

module.exports = Tux;
