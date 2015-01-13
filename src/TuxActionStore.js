'use strict';

var createStore = require('tux/Stores').createStore;
var Actions = require('tux/Actions');

//createActionStore FUNCTION: creates a tuxStore with 'register' convenience method for automatically registering the store with Actions.
//@param methods OBJECT: key value pairs that will be added to the store being created
  //additional keys:
  // register FUNCTION: convenience method for invoking Actions.register.  Actions.register will be invoked with the newly created tuxStore and the return of the method at the register key.  Thus, the register method should return an OBJECT following the normal requirements for the second input to Actions.register.  The method will be invoked with the context of the tuxStore.
var createActionStore = function (methods) {
  var tuxStore = createStore(methods);
  //if the tuxStore has a register method than register it to tux/Actions
  var registerToActions = methods.register;
  if (registerToActions) {
    //invoke the Actions.register with our tuxStore and the result of our TuxStore.register method invoked with the context of the tuxStore
    Actions.register(tuxStore, registerToActions.call(tuxStore));
  }
  //return our tuxStore
  return tuxStore;
};

module.exports = createActionStore;
