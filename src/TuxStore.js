'use strict';

// require an instance of the EventEmitter
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
// the default change event string
var defaultChangeEvent = 'CHANGE';

// TuxStore FUNCTION
// @param methods OBJECT: key value pairs that will be added to the store being created
  // additional keys:
  //  register FUNCTION: convenience method for invoking Actions.register.  Actions.register will be invoked with the tuxStore that will be returned and the result of the function at the register key.  Thus the function should return an OBJECT as per the normal requirements for the second input to Actions.register.  The function will be invoked with the context of the tuxStore.
var TuxStore = function (methods) {
  // creating a TuxStore object then adding the EventEmitter prototype, method to emit change and listeners, and user specified methods
  var tuxStoreInstance = assign({}, EventEmitter.prototype, {

    // emitChange FUNCTION
    // @param CHANGE_EVENT String: optional event type string. defaultChangeEvent will be used otherwise.
    emitChange: function (CHANGE_EVENT) {
      CHANGE_EVENT = CHANGE_EVENT || defaultChangeEvent;
      this.emit(CHANGE_EVENT);
    },

    // addChangeListener FUNCTION
    // @param callback Function: function that will executed upon the specified CHANGE_EVENT
    // @param CHANGE_EVENT String: optional event type string. defaultChangeEvent will be used otherwise.
    addChangeListener: function (callback, CHANGE_EVENT) {
      CHANGE_EVENT = CHANGE_EVENT || defaultChangeEvent;
      this.on(CHANGE_EVENT, callback);
    },

    // removeChangeListener FUNCTION
    // @param callback Function: function that will be removed from being executed upon the specified CHANGE_EVENT
    // @param CHANGE_EVENT String: optional event type string. defaultChangeEvent will be used otherwise.
    removeChangeListener: function (callback, CHANGE_EVENT) {
      CHANGE_EVENT = CHANGE_EVENT || defaultChangeEvent;
      this.removeListener(CHANGE_EVENT, callback);
    }
  }, methods);

  //if the tuxStore has a register method than register it to tux/Actions
  var registerToActions = tuxStoreInstance.register;
  if (registerToActions) {
    //only require tux/Actions if we have the register method defined
    var Actions = require('tux/Actions');
    //invoke the Actions.register with our tuxStoreInstance and the result of our TuxStore.register method invoked with the context of the tuxStoreInstance
    Actions.register(tuxStoreInstance, registerToActions.call(tuxStoreInstance));
  }

  //return our tuxStoreInstance
  return tuxStoreInstance;
};

// export TuxStore
module.exports = TuxStore;
