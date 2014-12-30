'use strict';

var React = require('react');

var Flux = require('flux');

var Tux = Object.create(React);
Tux.Dispatcher = Flux.Dispatcher;

//Tux Components
Tux.components.form = require('react-validating-form');

module.exports = Tux;
