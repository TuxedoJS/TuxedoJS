'use strict';

var architecture = {};

var ArchitectChain = function (storeToArchitect) {
  this.storeToArchitect = storeToArchitect;
};

ArchitectChain.prototype._getRegisterId = function (inputOrStore) {
  var storeToWaitFor, storeRegistrationId;
  if (typeof inputOrStore === 'string') {
    storeToWaitFor = architecture[inputOrStore];
    if (!storeToWaitFor) {
      throw new Error('store is waiting for an input: "' + inputOrStore + '" that no store outputs.  If this store needs no inputs than only call "itOutputs"');
    }
  } else {
    storeToWaitFor = inputOrStore;
  }
  storeRegistrationId = storeToWaitFor.__registerId__;
  if (storeRegistrationId) {
    return storeRegistrationId;
  } else {
    throw new Error('store is waiting for a store that has not been registered to the dispatcher');
  }
};
ArchitectChain.prototype.itNeeds = function (inputOrStore) {
  var result = [];
  if (Array.isArray(inputOrStore)) {
    var inputOrStoreLength = inputOrStore.length;
    for (var i = 0; i < inputOrStoreLength; i++) {
      result.push(this._getRegisterId(inputOrStore[i]));
    }
  } else {
    result.push(this._getRegisterId(inputOrStore));
  }
  var tuxArchitecture = this.storeToArchitect.__tuxArchitecture__;
  if (tuxArchitecture) {
    tuxArchitecture = tuxArchitecture.concat(result);
  } else {
    tuxArchitecture = result;
  }
  this.storeToArchitect.__tuxArchitecture__ = tuxArchitecture;
  this.and = ArchitectChain.prototype.itNeeds;
  return this;
};
ArchitectChain.prototype._registerOutputToArchitecture = function (output) {
  if (architecture[output]) {
    throw new Error('output: "' + output + '" is already registered to a store');
  } else {
    architecture[output] = this.storeToArchitect;
  }
};
ArchitectChain.prototype.itOutputs = function (output) {
  if (typeof output === 'string') {
    this._registerOutputToArchitecture(output);
  } else {
    var outputLength = output.length;
    for (var i = 0; i < outputLength; i++) {
      this._registerOutputToArchitecture(output[i]);
    }
  }
  this.and = ArchitectChain.prototype.itOutputs;
  return this;
};

var architect = function (storeToArchitect) {
  var architectChain = new ArchitectChain(storeToArchitect);
  return architectChain;
};

module.exports = architect;
