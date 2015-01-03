var React = require('react');
var getOwnerPropsMixin = require('./TuxGetOwnerPropsMixin');
var assign = require('object-assign');

var mixinsToAdd, mixins;
var createOwneeClass = function (owneeClassProps) {
  mixinsToAdd = [getOwnerPropsMixin];

  mixins = owneeClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }

  return React.createClass(assign({}, owneeClassProps, {
    mixins: mixinsToAdd
  }));

};

module.exports = createOwneeClass;
