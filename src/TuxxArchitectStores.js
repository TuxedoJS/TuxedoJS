'use strict';

var invariant = require('tuxx/src/TuxxInvariant');
//architecture OBJECT: stores will register their outputs to this object so that store inputs can lookup those outputs later
var architecture = {};

//ArchitectChain CONSTRUCTOR FUNCTION: produces architectChain instances which allow stores to chain methods for defining their inputs and outputs
//@param storeToArchitect: store OBJECT that inputs and outputs will be registered to
var ArchitectChain = function (storeToArchitect) {
  this.storeToArchitect = storeToArchitect;
};

//prototype methods
//itNeeds FUNCTION: registers the input(s) and/or store(s) that the store will need to waitFor, returns this architectChain instance to allow for method chaining, updates "and" method to allow chaining via conjuction
//@param inputOrStore STRING: input string to be checked against the architecture object for the corresponding store or set of stores [ALTERNATE OBJECT: if a store is passed in then lookup __registerId__ on the passed in store] [ALTERNATE ARRAY: can pass in an array of inputs and/or stores to be registered, method chaining will still function properly in this case]
//can accept any number of input arguments: strings, objects, or arrays of strings and/or objects
ArchitectChain.prototype.itNeeds = function (inputOrStore) {
  var i;
  var argumentsLength = arguments.length;
  //if more than one argument was submitted and then invoke itNeeds with each argument
  if (argumentsLength > 1) {
    for (i = 0; i < argumentsLength; i++) {
      this.itNeeds(arguments[i]);
    }
  } else {
    //array of ids to register to the store
    var waitForIds = [];
    //if inputOrStore is array
    if (Array.isArray(inputOrStore)) {
      var inputOrStoreLength = inputOrStore.length;
      //concat each inputOrStore's __registerId__ or set of __registerId__'s
      for (i = 0; i < inputOrStoreLength; i++) {
        waitForIds = waitForIds.concat(getRegisterId(inputOrStore[i]));
      }
    } else {
      //if inputOrStore is not an array then concat its corresponding __registerId__ or set of __registerId__'s
      waitForIds = waitForIds.concat(getRegisterId(inputOrStore));
    }
    //if the storeToArchitect has already been architected at some point than add waitForIds array on to existing array
    var tuxxArchitecture = this.storeToArchitect.__tuxxArchitecture__;
    if (tuxxArchitecture) {
      tuxxArchitecture = tuxxArchitecture.concat(waitForIds);
    } else {
      //if it has not been architected than just use waitForIds array
      tuxxArchitecture = waitForIds;
    }
    //attach architecture array to storeToArchitect at the key of __tuxxArchitecture__
    this.storeToArchitect.__tuxxArchitecture__ = tuxxArchitecture;
  }
  //update "and" method so user can chain additional needed inputs with "and"
  this.and = this.itNeeds;
  //return this architectChain instance to enable method chaining
  return this;
};

//itOutputs FUNCTION: registers the output(s) that the store will be mapped to in the architecture OBJECT, returns this architectChain instance to allow for method chaining, updates "and" method to allow chaining via conjuction
//@param output STRING: output STRING to which storeToArchitect will be mapped to on the architecture OBJECT [ALTERNATE ARRAY: can pass in an array of output STRINGs to which store will be mapped to on the architecture OBJECT]
//can accept any number of input arguments: strings or arrays of strings
ArchitectChain.prototype.itOutputs = function (output) {
  var i;
  var argumentsLength = arguments.length;
  //if more than one argument was submitted and then invoke itOutputs with each argument
  if (argumentsLength > 1) {
    for (i = 0; i < argumentsLength; i++) {
      this.itOutputs(arguments[i]);
    }
  } else {
    if (Array.isArray(output)) {
      //if output is an array than map each string in array to architecture OBJECT
      var outputLength = output.length;
      for (i = 0; i < outputLength; i++) {
        registerOutputToArchitecture(output[i], this.storeToArchitect);
      }
    } else {
      registerOutputToArchitecture(output, this.storeToArchitect);
    }
  }
  //update "and" method so user can chain additional outputs with "and"
  this.and = this.itOutputs;
  //return this architectChain instance to enable method chaining
  return this;
};

//getRegisterId FUNCTION: internal function, for getting the store or set of stores' __registerId__ or set of __registerId__'s from either the passed in store or the store/set of stores mapped to the passed in input
//@param inputOrStore STRING: input string to be checked against the architecture OBJECT for the corresponding store [ALTERNATE OBJECT: if a store is passed in then lookup __registerId__ on the passed in store]
var getRegisterId = function (inputOrStore) {
  var storeOrStoresToWaitFor, storeRegistrationIdOrIds;
  //if inputOrStore is a string
  if (typeof inputOrStore === 'string') {
    //lookup corresponding store or stores in the architecture object
    storeOrStoresToWaitFor = architecture[inputOrStore];
    //if no store maps to this input throw error
    invariant(storeOrStoresToWaitFor, 'store is waiting for an input: "%s" that no store outputs.  If this store needs no inputs than only call "itOutputs" method.', inputOrStore);
  } else {
    //if inputOrStore is a store use that
    storeOrStoresToWaitFor = inputOrStore;
  }
  //return  __registerId__ or set of __registerId__'s from storeOrStoresToWaitFor
  storeRegistrationIdOrIds = returnOneOrMultipleRegisterIds(storeOrStoresToWaitFor);
  return storeRegistrationIdOrIds;
};

//returnOneOrMultipleRegisterIds FUNCTION: internal function, used by getRegisterId to return one or a set registerId's from a store or set of stores
//@param storeOrStoresToWaitFor ARRAY or STRING: input string or array of strings representing all stores being waited on
var returnOneOrMultipleRegisterIds = function (storeOrStoresToWaitFor) {
  var storeRegistrationId;
  //error to throw if a store does not have a __registerId__ property
  var noRegisteredIdError = 'store is waiting for a store that has not been registered to any actions.';
  //if storeOrStoresToWaitFor is an array holding multiple stores
  if (Array.isArray(storeOrStoresToWaitFor)) {
    var storeRegistrationIds = [];
    var storeOrStoresToWaitForLength = storeOrStoresToWaitFor.length;
    //grab the __registerId__ from each individual store and return them as an array
    for (var i = 0; i < storeOrStoresToWaitForLength; i++) {
      storeRegistrationId = storeOrStoresToWaitFor[i].__registerId__;
      //if store does not have __registerId__ then it has not been registered to the dispatcher so throw an error
      invariant(storeRegistrationId, noRegisteredIdError);
      storeRegistrationIds.push(storeRegistrationId);
    }
    return storeRegistrationIds;
  } else {
    //return __registerId__ from storeOrStoresToWaitFor
    storeRegistrationId = storeOrStoresToWaitFor.__registerId__;
    //if store does not have __registerId__ then it has not been registered to the dispatcher so throw an error
    invariant(storeRegistrationId, noRegisteredIdError);
    return storeRegistrationId;
  }
};

//registerOutputToArchitecture FUNCTION: internal function, registers an output STRING key to the architecture OBJECT with the value of storeToArchitect so that the storeToArchitect can later be looked up by passing the same output STRING to itNeeds
//@param output STRING: output STRING to which storeToArchitect will be mapped to on the architecture OBJECT
var registerOutputToArchitecture = function (output, storeToArchitect) {
  var mappedStores = architecture[output];
  //if this output is already registered to architecture OBJECT
  if (mappedStores) {
    var outputArray = [];
    //add storeToArchitect as another registered output to architecture OBJECT
    architecture[output] = outputArray.concat(mappedStores, storeToArchitect);
  } else {
    //if this output is not already registered to architecture OBJECT, register it
    architecture[output] = storeToArchitect;
  }
};

//architect FUNCTION: accepts a storeToArchitect and returns an instance of architectChain which will register the inputs and outputs for the passsed in store
//@param storeToArchitect OBJECT: store that needs and outputs will be mapped to by the returned architectChain instance
var architect = function (storeToArchitect) {
  return new ArchitectChain(storeToArchitect);
};

module.exports = architect;
