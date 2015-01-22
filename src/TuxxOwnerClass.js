'use strict';

var owneeClass = require('tuxx/src/TuxxOwneeClass');
var StoreMixinGenerator = require('tuxx/src/TuxxStoreMixinGenerator');
var assign = require('object-assign');

//createOwnerClass FUNCTION: creates an owner Tuxx Class which is a type of React class designed to manage application state, interact with stores, manage route params, and pass props into its ownee components
//@param ownerClassProps OBJECT: properties that the new ownerClass will possess, should be a standard React.createClass object with properties such as componentWillMount, componentDidMount, etc.  Please see http://facebook.github.io/react/docs/component-specs.html for a full list of React props
  //required keys:
  // render FUNCTION: since this is an implementation of React.createClass a render method is required
  //additional keys
    //connectOwnerToStore FUNCTION: returns an OBJECT defining the TuxxStore for which callbacks will be registered. "this" will be bound to the component in this function. [ALTERNATE ARRAY: array of functions with the component as "this" that return objects with same keys as listed below]
      //expected keys:
      // store OBJECT: store object that the event and listener should be attached to
      // listener FUNCTION: callback function to be invoked upon associated event [ALTERNATE ARRAY: array of callback functions]
      // event STRING: event type to trigger listener callback function [ALTERNATE ARRAY: array of event type strings]
    //registerOwnerProps FUNCTION: returns an OBJECT defining the properties the owner will expose to its direct Ownees. The function will be invoked with the context of the owner component and all top level methods in the object will be bound to the component context
var connectOwnerToStore, mixinsToAdd, mixins;
var createOwnerClass = function (ownerClassProps) {
  mixinsToAdd = [];
  //if connectOwnerToStore is defined than add a storeMixin with it
  connectOwnerToStore = ownerClassProps.connectOwnerToStore;
  if (connectOwnerToStore) {
    mixinsToAdd.push(StoreMixinGenerator(connectOwnerToStore));
  }
  //concat any mixins passed in through ownerClassProps to mixinsToAdd.  Note that mixins is concated on to mixinsToAdd (not the other way around) so that all Tuxx mixins will be invoked first
  mixins = ownerClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }
  //pass in props to owneeClass to get base tuxx mixins
  return owneeClass(assign({}, ownerClassProps, {
    //add marker prop to indicate this class will be an owner component
    __tuxxIsOwnerComponent__: true,
    mixins: mixinsToAdd
  }));
};

module.exports = createOwnerClass;
