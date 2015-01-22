var React = require('react');
var getOwnerPropsMixin = require('tuxx/src/TuxxGetOwnerPropsMixin');
var propTypeCheckerMixin = require('tuxx/src/TuxxPropTypeCheckerMixin');
var assign = require('object-assign');

//createOwneeClass FUNCTION: creates an ownee Tuxx Class which is a type of React class not designed to manage any of its own state other than, in some cases, necessary state to implement two-way data-binding for input validation
//@param owneeClassProps OBJECT: properties that the new owneeClass will possess, should be a standard React.createClass object with properties such as componentWillMount, componentDidMount, etc.  Please see http://facebook.github.io/react/docs/component-specs.html for a full list of React props
  //required keys:
  // render FUNCTION: since this is an implementation of React.createClass a render method is required
var mixinsToAdd, mixins;
var createOwneeClass = function (owneeClassProps) {
  //add mixins that do not need to be generated via passed in props
  //getOwnerPropsMixin: allows Ownee to access the ownerProps of the nearest Owner through the key nearestOwnerProps
  mixinsToAdd = [getOwnerPropsMixin];
  //if not the production environment
  if ("production" !== process.env.NODE_ENV) {
    //if the nearestOwnerPropTypes or anyPropTypes keys are defined
    if (owneeClassProps.nearestOwnerPropTypes || owneeClassProps.anyPropTypes) {
      //add the prop checker mixin to the mixinsToAdd, note that this is added after the getOwnerPropsMixin so that nearestOwnerProps will be exposed for this mixin
      mixinsToAdd.push(propTypeCheckerMixin);
    }
  }
  //concat any mixins passed in through owneeClassProps to mixinsToAdd.  Note that mixins is concated on to mixinsToAdd (not the other way around) so that all Tuxx mixins will be invoked first
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
