'use strict';

//TuxStoreMixinGenerator FUNCTION: creates an object with the componentDidMount and componentWillUnmount methods that will add and remove the specified event listeners from the provided store
//@param props OBJECT: TuxStore for which actions will be registered [ALTERNATE ARRAY: array of objects with same keys as listed below]
  //expected keys:
  // store OBJECT: store object that the event and listener should be attached to
  // listener FUNCTION: callback function to be invoked upon associated event [ALTERNATE ARRAY: array of callback functions]
  // event STRING: event type to trigger listener callback function [ALTERNATE ARRAY: array of event type strings]
var TuxStoreMixinGenerator = function (props) {
  var storeConnections = {};
  if (Array.isArray(props)) {
    var propsLength = props.length;

    // add the events and listeners for the particular store to the componentDidMount React life cycle event
    storeConnections.componentDidMount = function () {
      for (var i = 0; i < propsLength; i++) {
        // map addChangeListeners, due to the second input argument set to true, to store, listeners, and events passed in
        mapListenersAndEventsToStore(props[i], true);
      }
    };

    // remove the events and listeners for the particular store to the componentWillUnmount React life cycle event
    storeConnections.componentWillUnmount = function () {
      for (var i = 0; i < propsLength; i++) {
        // map removeChangeListeners, due to the second input argument set to false, to store, listeners, and events passed in
        mapListenersAndEventsToStore(props[i], false);
      }
    };
  } else if (typeof props === 'object' && props !== null) {
    storeConnections.componentDidMount = function () {
      mapListenersAndEventsToStore(props, true);
    };

    storeConnections.componentWillUnmount = function () {
      mapListenersAndEventsToStore(props, false);
    };
  }

  return storeConnections;
};

//mapListenersAndEventsToStore FUNCTION maps adding or removing change listeners from a store
//@param storeConfig OBJECT: contains the store object that the event types and the listener callbacks will be attached to
  //expected keys:
  // store OBJECT: store object that the event and listener should be attached to
  // listener FUNCTION: callback function to be invoked upon associated event [ALTERNATE ARRAY: array of callback functions]
  // event STRING: event type to trigger listener callback function [ALTERNATE ARRAY: array of event type strings]
//@param addRemoveListener BOOLEAN: true to addChangeListener, false to removeChangeListener
var mapListenersAndEventsToStore = function (storeConfig, addOrRemoveListener) {
  addOrRemoveListener = addOrRemoveListener ? 'addChangeListener' : 'removeChangeListener';

  // get store object
  var store = storeConfig.store;
  // get listener/s
  var listener = storeConfig.listener;
  // deterimine if listener is an array of callbacks, if it isn't it will be converted a single element array for ease of looping if event is an array
  var listenerIsArray = Array.isArray(listener);
  // get event/s
  var event = storeConfig.event;
  //determine if event is an array of change event types, if it isn't it will be converted to a single element array for ease of looping if listener is an array
  var eventIsArray = Array.isArray(event);

  // check to see if either listener or event is an array and if one is the other will be changed to an array
  if (listenerIsArray || eventIsArray) {
    if (!listenerIsArray) {
      listener = [listener];
    } else if (!eventIsArray) {
      event = [event];
    }
    // pre-calculate listener and event lengths
    var listenerLength = listener.length;
    var eventLength = event.length;

    // determine which array is a longer length and set longerLength to that value. This is done if one is larger than the other,
    // so that the last element of the shorter array will be paired with the remaining elements of the longer array
    var longerLength = listenerLength;
    if (listenerLength < eventLength) {
      longerLength = eventLength;
    }

    // loop through and either add or remove change listeners with the specified event type from the store
    for (var i = 0; i < longerLength; i++) {
      var currentListener = listener[i] || listener[listenerLength - 1];
      var currentEvent = event[i] || event[eventLength - 1];
      store[addOrRemoveListener](currentListener, currentEvent);
    }
  } else {
    // if neither the listener or event was an array, the add or remove change listener can be invoked without converting them to arrays
    store[addOrRemoveListener](listener, event);
  }
};

// export TuxStoreMixinGenerator
module.exports = TuxStoreMixinGenerator;
