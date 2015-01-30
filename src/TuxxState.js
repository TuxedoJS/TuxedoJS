'use strict';

var assign = require('object-assign');
var invariant = require('tuxx/src/TuxxInvariant');

// buildNewState FUNCTION: internal function that creates an updated state object by invoking callback on the deepest keys of the newProps object, throwing an error if any of the keys in newProps dont match the corresponding keys in currentState
// @param currentState OBJECT: a shallow copy of this.state
// @param newProps OBJECT: an object holding keys that should match those in currentState and whose values will each be passed to callback
// @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
var buildNewState = function (currentState, newProps, callback) {
  // create empty object which will be used to build the eventual state object that will be passed in to setState after our callback has been invoked on the proper deep keys
  // NOTE: React's setState method makes a shallow copy of the keys at the top-most level, so we don't need to make a shallow copy of the top-most keys here, but rather, make shallow copies of keys at every level EXCEPT for the top
  var newState = {};

  // recurseKeys FUNCTION: traverses through keys in a heavily nested object, building our newState object as we iterate through potential nested objects and setting the deepest keys passed by newProps to be the result of invoking our callback on the deepest keys in the newProps and corresponding currentState keys
  // @param currentST OBJECT: properties of the currentState
  // @param newST OBJECT: properties of the newState
  // @param newPR OBJECT: properties of the newProps
  var recurseKeys = function (currentSt, newSt, newPr) {
    for (var key in newPr) {
      if (newPr.hasOwnProperty(key)) {
        var valAtKey = newPr[key];
        var stAtKey = currentSt[key];
        // if the value at this newProps key is defined and is an object, and if it matches the corresponding key in the current state which is also defined and is an object
        if (valAtKey !== null && typeof valAtKey === 'object' && !Array.isArray(valAtKey) && stAtKey !== null && typeof stAtKey === 'object' && !Array.isArray(stAtKey)) {
          // shallow copy the keys from the currentState into our newState so that there are no references to the currentState keys, but our newState contains identical values
          newSt[key] = assign({}, stAtKey);
          // invoke recurseKeys with the nested objects inside the current key
          recurseKeys(stAtKey, newSt[key], valAtKey);
        } else {
          // we have found a deep key in newProps and all keys match so far, so we invoke our callback, which sets the result of invoking our callback with these deep keys to be the value at the corresponding key in our newState
          callback(newSt, key, stAtKey, valAtKey);
        }
      }
    }
  };
  // invoke recurseKeys and build newState object by passing in the currentState, our empty newState, and newProps
  recurseKeys(currentState, newState, newProps);
  return newState;
};

// invariantNumberCheck FUNCTION: internal function that ensures a given value is a number or throws an error
// @param input UNKNOWN: value we are performing invariant check upon
var invariantNumberCheck = function (input) {
  if (typeof(input) !== "number") {
    invariant(!input, 'Cannot perform operation on "%s" because it is not of type number.', input);
  };
};

// invariantArrayCheck FUNCTION: internal function that ensures a given value is an array or throws an error
// @param input UNKNOWN: value we are performing invariant check upon
var invariantArrayCheck = function (input) {
  if (!Array.isArray(input)) {
    invariant(!input, 'Cannot perform operation on "%s" because it is not an array.', input);
  };
};

// invariantValueCheck FUNCTION: internal function that ensures a given value is not stored in an array or an object
// @param input UNKNOWN: value we are performing invariant check upon
var invariantValueCheck = function (input) {
  if (typeof(input) === "object") {
    invariant(!input, 'Cannot perform operation on "%s" because it must not be an array or object.', input);
  }
};

// invariantNumberOrStringCheck FUNCTION: internal function that ensures a given value is a number or string or throws an error
// @param input UNKNOWN: value we are performing invariant check upon
var invariantNumberOrStringCheck = function (input) {
  if (typeof(input) !== "number" && typeof(input) !== "string") {
    invariant(!input, 'Cannot perform operation on "%s" because it is not of type number or of type string.', input);
  };
};

// invariantArgCheck FUNCTION: internal function that ensures a given value is defined and is an object or throws an error
// @param input UNKNOWN: value we are performing invariant check upon
var invariantArgCheck = function (input) {
  if (!input) {
    invariant(input, 'This function requires an object as an argument.');
  } else if (Object.prototype.toString.call(input) !== '[object Object]') {
    invariant(!input, 'This function requires an object as an argument.');
  }
};

// mixin to React class that will provide convenience methods for updating state
module.exports = {
  // addState FUNCTION: adds the values of the deepest keys in the passed in object to the corresponding deepest keys in the current state, or throws an error if keys don't match
  // @param propsToAdd OBJECT: required object argument where the deepest keys are numbers or strings
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  addState: function (propsToAdd, callback) {
    // throw error if propsToAdd is undefined or not an object
    invariantArgCheck(propsToAdd);
    // build new state object
    var newState = buildNewState(this.state, propsToAdd, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // throw error if newPropsAtKey is not a number or string
      invariantNumberOrStringCheck(newPropsAtKey);
      // perform addition on the corresponding deep keys
      newState[key] = currentStateAtKey + newPropsAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // subtractState FUNCTION: subtracts the values of the deepest keys in the passed in object from the corresponding deepest keys in the current state, or throws an error if keys don't match
  // @param propsToSubtract OBJECT: required object argument where the deepest keys are numbers
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  subtractState: function(propsToSubtract, callback) {
    // throw error if propsToSubtract is undefined or not an object
    invariantArgCheck(propsToSubtract);
    // build new state object
    var newState = buildNewState(this.state, propsToSubtract, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      // perform subtraction on the corresponding deep keys
      newState[key] = currentStateAtKey - newPropsAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // multiplyState FUNCTION: multiply the values of the deepest keys in the passed in object by the corresponding deepest keys in the current state, or throws an error if keys don't match
  // @param propsToMultiply OBJECT: required object argument where the deepest keys are numbers
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  multiplyState: function (propsToMultiply, callback) {
    // throw error if propsToMultiply is undefined or not an object
    invariantArgCheck(propsToMultiply);
    // build new state object
    var newState = buildNewState(this.state, propsToMultiply, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      // perform multiplication on the corresponding deep keys
      newState[key] = currentStateAtKey * newPropsAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // divideState FUNCTION: divide the values of the deepest keys in the current state by the values of corresponding deepest keys in the passed in object, or throws an error if keys don't match
  // @param propsToDivide OBJECT: required object argument where the deepest keys are numbers
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  divideState: function (propsToDivide, callback) {
    // throw error if propsToDivide is undefined or not an object
    invariantArgCheck(propsToDivide);
    // build new state object
    var newState = buildNewState(this.state, propsToDivide, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      // perform division on the corresponding deep keys
      newState[key] = currentStateAtKey / newPropsAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // omitState FUNCTION: removes the deepest keys in the passed in object from the corresponding deepest keys in the current state, or throws an error if keys don't match
  // @param propsToOmit OBJECT: required object argument where the deepest keys are booleans
  // @param callback FUNCTION: optional callback that will be executed once setState is completed and the component is re-rendered
  omitState: function (propsToOmit, callback) {
    //throw error if propsToOmit is undefined or not an object
    invariantArgCheck(propsToOmit);
    //build new state object
    var newState = buildNewState(this.state, propsToOmit, function (newState, key, currentStateAtKey, newPropsAtKey) {
      //check that newPropsAtKey is true
      if (newPropsAtKey === true) {
        //remove the deepest key
        delete newState[key];
      }
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.replaceState(newState, callback);
  },

  // extendState FUNCTION: overrides pre-existing keys and adds any new keys from the passed in object to the current state, or throws error if no outer keys in passed in object match any outer keys in the current state
  // @param propsToExtend OBJECT: required object argument with at least one outer key matching an outer key in the current state, and any additional keys being keys to add to the current state
  // @param callback FUNCTION: optional callback that will be executed once setState is completed and the component is re-rendered
  extendState: function (propsToExtend, callback) {
    // throw error if propsToExtend is undefined or not an object
    invariantArgCheck(propsToExtend);
    var matchedKey = false;
    // check that at least one outer key in the passed in object matches an outer key in the current state
    for (var key in propsToExtend) {
      if (this.state[key]) {
        //if we find any key that maches a key in the current state, set matchedKey to true
        matchedKey = true;
      }
    }
    // throw error if no outer keys match any outer keys in the current state
    invariant(matchedKey, "At least one outer key must match an outer key in the current state. Use setState if you only wish to add new keys and not change existing keys.");
    // build new object with all keys in the current state plus any additional keys in propsToExtend, overriding any matching keys with those in propsToExtend
    var newState = assign({}, this.state, propsToExtend);
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // pushState FUNCTION: push the values at the deepest keys in the passed in object to the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToPush OBJECT: required object argument where the deepest keys are single values
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  pushState: function (propsToPush, callback) {
    // throw error if propsToPush is undefined or not an object
    invariantArgCheck(propsToPush);
    // build new state object
    var newState = buildNewState(this.state, propsToPush, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // check that currentStateAtKey key is an array
      invariantArrayCheck(currentStateAtKey);
      // check that there is only one value being pushed in
      invariantValueCheck(newPropsAtKey);
      // push newPropsAtKey into the corresponding key in the current state
      currentStateAtKey.push(newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // popState FUNCTION: match the values at the deepest keys in the passed in object and pop values off the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToPop OBJECT: required object argument where the deepest keys are booleans
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  popState: function (propsToPop, callback) {
    // throw error if propsToPop is undefined or not an object
    invariantArgCheck(propsToPop);
    // build new state object
    var newState = buildNewState(this.state, propsToPop, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // check that currentStateAtKey key is an array
      invariantArrayCheck(currentStateAtKey);
      // check that newPropsAtKey is true
      if (newPropsAtKey === true) {
        // pop a value off the corresponding key in the current state
        currentStateAtKey.pop();
        newState[key] = currentStateAtKey;
      }
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // unshiftState FUNCTION: unshift the values at the deepest keys in the passed in object to the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToUnshift OBJECT: required object argument where the deepest keys are single values
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  unshiftState: function(propsToUnshift, callback) {
    // throw error if propsToUnshift is undefined or not an object
    invariantArgCheck(propsToUnshift);
    // build new state object
    var newState = buildNewState(this.state, propsToUnshift, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // check that currentStateAtKey key is an array
      invariantArrayCheck(currentStateAtKey);
      // check that there is only one value being pushed in
      invariantValueCheck(newPropsAtKey);
      // unshift newPropsAtKey into the corresponding key in the current state
      currentStateAtKey.unshift(newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // shiftState FUNCTION: match the values at the deepest keys in the passed in object and shift values off the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToShift OBJECT: required object argument where the deepest keys are booleans
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  shiftState: function(propsToShift, callback) {
    // throw error if propsToShift is undefined or not an object
    invariantArgCheck(propsToShift);
    // build new state object
    var newState = buildNewState(this.state, propsToShift, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // check that currentStateAtKey key is an array
      invariantArrayCheck(currentStateAtKey);
      // check that newPropsAtKey is true
      if (newPropsAtKey === true) {
        // shift a value off the corresponding key in the current state
        currentStateAtKey.shift();
        newState[key] = currentStateAtKey;
      }
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // spliceState FUNCTION: invoke splice using the values at the deepest keys in the passed in object on the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToSplice OBJECT: required object argument where the deepest keys are an array of arguments with which to invoke splice
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  spliceState: function(propsToSplice, callback) {
    // throw error if propsToSplice is undefined or not an object
    invariantArgCheck(propsToSplice);
    // build new state object
    var newState = buildNewState(this.state, propsToSplice, function (newState, key, currentStateAtKey, newPropsAtKey) {
      // check that currentStateAtKey key is an array
      invariantArrayCheck(currentStateAtKey);
      // invoke splice on currentStateAtKey with the array of arguments at newPropsAtKey
      Array.prototype.splice.apply(currentStateAtKey, newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // concatToEndOfState FUNCTION: concat the values at the deepest keys in the passed in object to the end of the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToConcat OBJECT: required object argument where the deepest keys are an array of values
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  concatToEndOfState: function(propsToConcat, callback) {
    // throw error if propsToConcat is undefined or not an object
    invariantArgCheck(propsToConcat);
    // build new state object
    var newState = buildNewState(this.state, propsToConcat, function (newState, key, currentStateAtKey, newPropsAtKey) {
      //check that the currentStateAtKey is an array
      invariantArrayCheck(currentStateAtKey);
      //check that  newProps at this key is an array
      invariantArrayCheck(newPropsAtKey);
      //set the newState at this key to be the concatted result
      newState[key] = currentStateAtKey.concat(newPropsAtKey);
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // concatToFrontOfState FUNCTION: concat the values at the deepest keys in the passed in object to the front of the arrays at the corresponding deepest keys of the current state, or throws an error if keys don't match
  // @param propsToConcat OBJECT: required object argument where the deepest keys are an array of values
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  concatToFrontOfState: function(propsToConcat, callback) {
    // throw error if propsToConcat is undefined or not an object
    invariantArgCheck(propsToConcat);
    // build new state object
    var newState = buildNewState(this.state, propsToConcat, function (newState, key, currentStateAtKey, newPropsAtKey) {
      //check that currentStateAtKey is an array
      invariantArrayCheck(currentStateAtKey);
      //check that newProps at this key is an array
      invariantArrayCheck(newPropsAtKey);
      //set the newState at this key to be the concatted result
      newState[key] = newPropsAtKey.concat(currentStateAtKey);
    });
    // update state with new values and pass callback (if provided), triggering re-render
    this.setState(newState, callback);
  },

  // resetState FUNCTION: resets the state to be the result of calling this.getInitialState()
  // @param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  resetState : function (callback) {
    // make a shallow copy of the return value from getInitialState()
    var newState = assign({}, this.getInitialState());
    // update state with new values and pass callback (if provided), triggering re-render
    this.replaceState(newState, callback);
  }
};
