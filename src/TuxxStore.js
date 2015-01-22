'use strict';

// require an instance of the EventEmitter
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
// the default change event string
var defaultChangeEvent = 'CHANGE';

// TuxxStore FUNCTION
// @param methods OBJECT: key value pairs that will be added to the store being created
var TuxxStore = function (methods) {
  // creating a TuxxStore object then adding the EventEmitter prototype, method to emit change and listeners, and user specified methods
  return assign({}, EventEmitter.prototype, {

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
};

// export TuxxStore
module.exports = TuxxStore;
