var React = require('react');
var assign = require('object-assign');
var GetOwnerPropsMixin = require('./TuxGetOwnerPropsMixin');
var assign = require('object-assign');

var mixinsToAdd, mixins;
var createOwneeClass = function (owneeClassProps) {
  mixinsToAdd = [GetOwnerPropsMixin];

  mixins = owneeClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }

  React.createClass(assign({}, owneeClassProps, {
    mixins: mixinsToAdd
  }));

};

module.exports = createOwneeClass;
