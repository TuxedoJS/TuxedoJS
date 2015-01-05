'use strict';

var invariant = require('./TuxInvariant');
//architecture OBJECT: stores will register their outputs to this object so that store inputs can lookup those outputs later
var architecture = {};

//ArchitectChain CONSTRUCTOR FUNCTION: produces architectChain instances which allow stores to chain methods for defining their inputs and outputs
//@param storeToArchitect: store OBJECT that inputs and outputs will be registered to
var ArchitectChain = function (storeToArchitect) {
  this.storeToArchitect = storeToArchitect;
};

//prototype methods
//itNeeds FUNCTION: registers the input(s) and/or store(s) that the store will need to waitFor, returns this architectChain instance to allow for method chaining, updates "and" method to allow chaining via conjuction
//@param inputOrStore STRING: input string to be checked against the architecture object for the corresponding store [ALTERNATE OBJECT: if a store is passed in than lookup __registerId__ on the passed in store] [ALTERNATE ARRAY: can pass in an array of inputs and/or stores to be registered, method chaining will still function properly in this case]
ArchitectChain.prototype.itNeeds = function (inputOrStore) {
  //array of ids to register to the store
  var waitForIds = [];
  //if inputOrStore is array
  if (Array.isArray(inputOrStore)) {
    var inputOrStoreLength = inputOrStore.length;
    //loop through inputOrStore array and push register id into waitForIds for each element in array
    for (var i = 0; i < inputOrStoreLength; i++) {
      waitForIds.push(this._getRegisterId(inputOrStore[i]));
    }
  } else {
    //if inputOrStore is not an array push its corresponding register id into array
    waitForIds.push(this._getRegisterId(inputOrStore));
  }
  //if the storeToArchitect has already been architected at some point than add waitForIds array on to existing array
  var tuxArchitecture = this.storeToArchitect.__tuxArchitecture__;
  if (tuxArchitecture) {
    tuxArchitecture = tuxArchitecture.concat(waitForIds);
  } else {
    //if it has not been architected than just use waitForIds array
    tuxArchitecture = waitForIds;
  }
  //attach architecture array to storeToArchitect at the key of __tuxArchitecture__
  this.storeToArchitect.__tuxArchitecture__ = tuxArchitecture;
  //update "and" method so user can chain additional needed inputs with "and"
  this.and = this.itNeeds;
  //return this architectChain instance to enable method chaining
  return this;
};

//itOutputs FUNCTION: registers the output(s) that the store will be mapped to in the architecture OBJECT, returns architectChain instance to allow for method chaining, updates "and" method to allow chaining via conjuction
//@param output STRING: output STRING to which storeToArchitect will be mapped to on the architecture OBJECT [ALTERNATE ARRAY: can pass in an array of output STRINGs to which store will be mapped to on the architecture OBJECT]
ArchitectChain.prototype.itOutputs = function (output) {
  //if output is a string than register it to architecture OBJECT
  if (typeof output === 'string') {
    this._registerOutputToArchitecture(output);
  } else {
    //if output is an array than map each string in array to architecture OBJECT
    var outputLength = output.length;
    for (var i = 0; i < outputLength; i++) {
      this._registerOutputToArchitecture(output[i]);
    }
  }
  //update "and" method so user can chain additional outputs with "and"
  this.and = this.itOutputs;
  //return this architectChain instance to enable method chaining
  return this;
};

//_getRegisterId FUNCTION: internal function,for getting the store __registerId__ from either the passed in store or the store mapped to the passed in input
//@param inputOrStore STRING: input string to be checked against the architecture OBJECT for the corresponding store [ALTERNATE OBJECT: if a store is passed in then lookup __registerId__ on the passed in store]
ArchitectChain.prototype._getRegisterId = function (inputOrStore) {
  var storeToWaitFor, storeRegistrationId;
  //if inputOrStore is a string
  if (typeof inputOrStore === 'string') {
    //lookup corresponding store in the architecture object
    storeToWaitFor = architecture[inputOrStore];
    //if no store maps to this input throw error
    invariant(storeToWaitFor, 'store is waiting for an input: "%s" that no store outputs.  If this store needs no inputs than only call "itOutputs" method.', inputOrStore);
  } else {
    //if inputOrStore is a store use that
    storeToWaitFor = inputOrStore;
  }
  //return __registerId__ from storeToWaitFor
  storeRegistrationId = storeToWaitFor.__registerId__;
  //if store does not have __registerId__ than it has not been registered to the dispatcher so throw an error
  invariant(storeRegistrationId, 'store is waiting for a store that has not been registered to any actions.');
  return storeRegistrationId;
};

//_registerOutputToArchitecture FUNCTION: internal function, registers an output STRING key to the architecture OBJECT with the value of storeToArchitect so that the storeToArchitect can later be looked up by passing the same output STRING to itNeeds
//@param output STRING: output STRING to which storeToArchitect will be mapped to on the architecture OBJECT
ArchitectChain.prototype._registerOutputToArchitecture = function (output) {
  //if this output is already registered to architecture OBJECT, throw error
  invariant(!architecture[output], 'output: "%s" is already registered to a store.', output);
  //map output STRING to storeToArchitect
  architecture[output] = this.storeToArchitect;
};

//architect FUNCTION: accepts a storeToArchitect and returns an instance of architectChain which will register the inputs and outputs for the passsed in store
//@param storeToArchitect OBJECT: store that needs and outputs will be mapped to by the returned architectChain instance
var architect = function (storeToArchitect) {
  return new ArchitectChain(storeToArchitect);
};

module.exports = architect;
