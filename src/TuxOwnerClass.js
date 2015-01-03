var React = require('react');
var GetOwnerStaticPropsMixin = require('./TuxGetOwnerStaticPropsMixin');
var StoreMixinGenerator = require('./TuxStoreMixinGenerator');
var assign = require('object-assign');

var connectOwnerToStore, mixinsToAdd, mixins;
var createOwnerClass = function (ownerClassProps) {
  mixinsToAdd = [GetOwnerStaticPropsMixin];

  connectOwnerToStore = ownerClassProps.connectOwnerToStore;
  if (connectOwnerToStore) {
    mixinsToAdd.push(StoreMixinGenerator(connectOwnerToStore));
  }

  mixins = ownerClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }

  React.createClass(assign({}, ownerClassProps, {
    __tuxIsOwnerComponent__: true,
    mixins: mixinsToAdd
  }));

};

module.exports = createOwnerClass;
