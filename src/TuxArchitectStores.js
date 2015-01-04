'use strict';

var architecture;

var architect = function (storeToArchitect) {
  var architectChain = {
    _getRegisterId: function (inputOrStore) {
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
    },
    itNeeds: function (inputOrStore) {
      var result = [];
      var itNeedsSingular = architectChain._getRegisterId;
      if (Array.isArray(inputOrStore)) {
        var inputOrStoreLength = inputOrStore.length;
        for (var i = 0; inputOrStoreLength; i++) {
          result.push(itNeedsSingular(inputOrStore[i]));
        }
      } else {
        result.push(itNeedsSingular(inputOrStore));
      }
      return {
        and: architectChain.itNeeds,
        itOutputs: architectChain.itOutputs
      };
    },
    itOutputs: function (output) {
      if (typeof output === 'string') {
        architecture[output] = storeToArchitect;
      } else {
        var outputLength = output.length;
        for (var i = 0; i < outputLength; i++) {
          architecture[output[i]] = storeToArchitect;
        }
      }
      return {
        and: architectChain.itOutputs
      };
    }
  };
  return architectChain;
};

module.exports = architect;
