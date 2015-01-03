var React = require('react');
var getOwnerPropsMixin = require('./TuxGetOwnerPropsMixin');
var assign = require('object-assign');

//createOwneeClass FUNCTION creates an ownee Tux Class which is a type of React class not designed to manage any of its own state other than, in some cases, necessary state to implement two-way data-binding
//@param owneeClassProps OBJECT: properties that the new owneeClass will possess, should be a standard React.createClass object with properties such as componentWillMount, componentDidMount, etc.  Please see http://facebook.github.io/react/docs/component-specs.html for a full list of React props
var mixinsToAdd, mixins;
var createOwneeClass = function (owneeClassProps) {
  //add mixins that do not need to be generated via passed in props
  //getOwnerPropsMixin: allows Ownee to access the ownerProps of the nearest Owner through the key nearestOwnerProps
  mixinsToAdd = [getOwnerPropsMixin];
  //concat any mixins passed in through owneeClassProps to mixinsToAdd.  Note that mixins is concatted on to mixinsToAdd (not the other way around) so that all Tux mixins will be invoked first
  mixins = owneeClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }
  //return React.createClass with augmented class properties
  return React.createClass(assign({}, owneeClassProps, {
    mixins: mixinsToAdd
  }));
};

module.exports = createOwneeClass;
