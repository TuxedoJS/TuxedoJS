'use strict';

var Tux = {};

Tux.React = require('./React');

Tux.Stores = require('./Stores');

Tux.Architecture = require('./Architecture');

Tux.Actions = require('./Actions');
Tux.createActionCategory = Tux.Actions.createActionCategory;

Tux.Router = require('react-router');

Tux.Components = {
  Form: require('./node_modules/react-validating-form')
};

console.warn('Using the Tux object directly is not recommended as it will mean loading all modules even those you don\'t intend to use.  Please review the TuxedoJS documents for requiring only the individual pieces of TuxedoJS that you will need.');

module.exports = Tux;
