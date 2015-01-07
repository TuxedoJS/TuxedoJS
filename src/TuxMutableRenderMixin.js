'use strict';

var invariant = require('./TuxInvariant');

// deepSearch FUNCTION: recursive function that creates an array of string keys to transverse the object specified by the @param mutableTrait key. Currently matches only the first path found.
// @param mutableTrait STRING: trait to find the path of keys within the objectToSearch
// @param objectToSearch OBJECT:
  // expected keys ANY: this object can contain any keys, but is expected to contain the key specified in mutableTrait
// @param currentPath STRING: either the string 'props' or 'state' [ALTERNATE ARRAY that contains either 'props' or 'state' at index 0]
var deepSearch = function (mutableTrait, objectToSearch, currentPath) {
  if (!Array.isArray(currentPath)) {
    currentPath = [currentPath];
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
        // recurse over the item at objectToSearch[key] with newPath as the currentPath input
        possibleResultPath = deepSearch(mutableTrait, objectToSearch[key], newPath);
        // break out of loop if a single valid path has been found
        if (possibleResultPath) {
          return possibleResultPath;
        }
      }
    }
  }
};

// TuxMutableRenderMixin OBJECT: adds mixin to React class that will add componentWillMount and shouldComponentUpdate life cycle events to the component
module.exports = {
  // componentWillMount FUNCTION: creates an array of string key paths attached to the component's constructor with a key of __tuxMutableTraits__.
  // These paths are used in the shouldComponentUpdate life cycle event to compare current and next values of the specified traits to determine
  // if the component should re-render.
  componentWillMount: function () {
    var mutableTraits = this.mutableTraits;
    var mutableTraitsPaths = [];
    var type, isArray, isString, mutableTraitsTypeLength, i, mutableType;

    // if __tuxMutableTraits__ is not defined
    if (!this.constructor.__tuxMutableTraits__) {
      for (type in mutableTraits) {
        // ensure mutableTraits hasOwnProperty type, otherwise it will walk up the prototype chain
        if (mutableTraits.hasOwnProperty(type)) {
          // store result of mutableTraits[type] to prevent repetitive lookups
          mutableType = mutableTraits[type];

          isArray = Array.isArray(mutableType);
          isString = typeof mutableType === 'string';

          invariant(isArray || isString, 'mutableTraits needs to be either an array or a string.');

          if (isArray) {
            mutableTraitsTypeLength = mutableType.length;

            for (i = 0; i < mutableTraitsTypeLength; i++) {
              mutableTraitsPaths.push(deepSearch(mutableType[i], this[type], type));
            }
          } else {
            mutableTraitsPaths.push(deepSearch(mutableType, this[type], type));
          }

          // add the trait paths to the constructor object, so only the first component of each class has to perform the deep search
          this.constructor.__tuxMutableTraits__ = mutableTraitsPaths;
        }
      }
    }
  },

  // shouldComponentUpdate FUNCTION: add component life cycle event to shouldComponentUpdate that returns a boolean value to determine whether or not the component should update
  // @param nextProps OBJECT: the updated values for the component's props that will be examined to see if it should re-render
  // @param nextState OBJECT: the updated values for the component's state that will be examined to see if it should re-render
  shouldComponentUpdate: function (nextProps, nextState) {
    // get mutableTraits
    var mutableTraits = this.constructor.__tuxMutableTraits__;

    invariant(mutableTraits, 'The __tuxMutableTraits__ property is not defined on the component.');

    // if mutableTraits is present
    if (mutableTraits) {
      var mutableTraitsLength = mutableTraits.length;
      // declare reused variables
      var traitPathLength, trait, traitPath, currentPathValue, nextPathValue, traitValue, mutableTraitPath;

      // for each trait path see if current is equal to next
      for (traitPath = 0; traitPath < mutableTraitsLength; traitPath++) {
        // calculate length of current trait path
        mutableTraitPath = mutableTraits[traitPath];
        traitPathLength = mutableTraitPath.length;
        currentPathValue = this;
        // group nextProps and nextState into the same object to allow easy transversal down key paths stored in __tuxMutableTraits__
        nextPathValue = {
          props: nextProps,
          state: nextState
        };

        // walk down to the end of each path in current and next objects
        for (trait = 0; trait < traitPathLength; trait++) {
          traitValue = mutableTraitPath[trait];
          currentPathValue = currentPathValue[traitValue];
          nextPathValue = nextPathValue[traitValue];
        }

        // if the currentPathValue doesn't equal nextPathValue the component should re-render.
        if (currentPathValue !== nextPathValue) {
          return true;
        }
      }
    }

    // nothing has changed, so return false, so component doesn't re-render
    return false;
  }
};
