'use strict';

var invariant = require('tux/src/TuxInvariant');
var unFoundError = 'Could not find "%s" within object';

// deepSearch FUNCTION: recursive function that creates an array of string keys to transverse the object specified by the @param mutableTrait key. Currently matches only the first path found.
// @param mutableTrait STRING: trait to find the path of keys within the objectToSearch [ALTERNATE ARRAY: to specify a hierarchy of keys to search pass in an ARRAY of STRINGS.  The deepSearch order will look for the strings starting with the first index in the array]
// @param objectToSearch OBJECT:
  // expected keys ANY: this object can contain any keys, but is expected to contain the key specified in mutableTrait
// @param currentPath STRING: either the string 'props' or 'state' [ALTERNATE ARRAY that contains either 'props' or 'state' at index 0]
var deepSearch = function (mutableTrait, objectToSearch, currentPath) {
  if (!Array.isArray(currentPath)) {
    //if currentPath is a string then wrap in an array
    if (currentPath) {
      currentPath = [currentPath];
    } else {
      //start with an empty array if currentPath is undefined
      currentPath = [];
    }
  }

  //if mutableTrait is an array
  if (Array.isArray(mutableTrait)) {
    var mutableTraitLength = mutableTrait.length;
    //invoke deepSearch with each element in the array, build out path over each iteration
    var fullPath = [];
    var iterationPath, iterationPathLength;
    for (var i = 0; i < mutableTraitLength; i++) {
      iterationPath = deepSearch(mutableTrait[i], objectToSearch, currentPath);

      //narrow down the objectToSearch by the iterationPath
      iterationPathLength = iterationPath.length;
      for (var j = 0; j < iterationPathLength; j++) {
        objectToSearch = objectToSearch[iterationPath[j]];
      }

      //concat iterationPath onto fullPath
      fullPath = fullPath.concat(iterationPath);
    }

    //after looping through return the fullPath
    return fullPath;
  }

  if (typeof objectToSearch === 'object' && objectToSearch !== undefined && objectToSearch !== null) {
    if (objectToSearch.hasOwnProperty(mutableTrait)) {
      // concat mutableTrait onto currentPath and return the result
      return currentPath.concat(mutableTrait);
    }

    // declare reused variables
    var key, newPath, possibleResultPath;

    for (key in objectToSearch) {
      if (objectToSearch.hasOwnProperty(key)) {
        // add the new key onto currentPath
        newPath = currentPath.concat(key);
        //try a recursion and catch errors so we do not throw an uncaught exception if the nested deepSearch fails
        try {
          // recurse over the item at objectToSearch[key] with newPath as the currentPath input
          possibleResultPath = deepSearch(mutableTrait, objectToSearch[key], newPath);
        } catch (e) {}
        // break out of loop if a single valid path has been found
        if (possibleResultPath) {
          return possibleResultPath;
        }
      }
    }
  }

  //throw an error if we never found the key, this error will be caught in nested searches
  invariant(false, unFoundError, mutableTrait);
};

module.exports = deepSearch;
