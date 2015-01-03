var React = require('react');
var getOwnerPropsMixin = require('./TuxGetOwnerPropsMixin');
var StoreMixinGenerator = require('./TuxStoreMixinGenerator');
var assign = require('object-assign');

var connectOwnerToStore, mixinsToAdd, mixins;
var createOwnerClass = function (ownerClassProps) {
  mixinsToAdd = [getOwnerPropsMixin];

  connectOwnerToStore = ownerClassProps.connectOwnerToStore;
  if (connectOwnerToStore) {
    mixinsToAdd.push(StoreMixinGenerator(connectOwnerToStore));
  }

  mixins = ownerClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }

  return React.createClass(assign({}, ownerClassProps, {
    __tuxIsOwnerComponent__: true,
    mixins: mixinsToAdd
  }));

};

module.exports = createOwnerClass;
