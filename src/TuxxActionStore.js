'use strict';

var createStore = require('tuxx/Stores').createStore;
var Actions = require('tuxx/Actions');

//createActionStore FUNCTION: creates a tuxxStore with 'register' convenience method for automatically registering the store with Actions.
//@param methods OBJECT: key value pairs that will be added to the store being created
  //additional keys:
  // register FUNCTION: convenience method for invoking Actions.register.  Actions.register will be invoked with the newly created tuxxStore and the return of the method at the register key.  Thus, the register method should return an OBJECT following the normal requirements for the second input to Actions.register.  The method will be invoked with the context of the tuxxStore.
var createActionStore = function (methods) {
  var tuxxStore = createStore(methods);
  //if the tuxxStore has a register method than register it to tuxx/Actions
  var registerToActions = methods.register;
  if (registerToActions) {
    //invoke the Actions.register with our tuxxStore and the result of our TuxxStore.register method invoked with the context of the tuxxStore
    Actions.register(tuxxStore, registerToActions.call(tuxxStore));
  }
  //return our tuxxStore
  return tuxxStore;
};

module.exports = createActionStore;
