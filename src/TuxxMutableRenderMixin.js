'use strict';

var invariant = require('tuxx/src/TuxxInvariant');
var deepSearch = require('tuxx/src/TuxxDeepSearch');

// TuxxMutableRenderMixin OBJECT: adds mixin to React class that will add componentWillMount and shouldComponentUpdate life cycle events to the component
module.exports = {
  // componentWillMount FUNCTION: creates an array of string key paths attached to the component's constructor with a key of __tuxxMutableTraits__.
  // These paths are used in the shouldComponentUpdate life cycle event to compare current and next values of the specified traits to determine
  // if the component should re-render.
  componentWillMount: function () {
    var mutableTraits = this.mutableTraits;
    var mutableTraitsPaths = [];
    var type, isArray, isString, mutableTraitsTypeLength, i, mutableType;

    // if __tuxxMutableTraits__ is not defined
    if (!this.constructor.__tuxxMutableTraits__) {
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
          this.constructor.__tuxxMutableTraits__ = mutableTraitsPaths;
        }
      }
    }
  },

  // shouldComponentUpdate FUNCTION: add component life cycle event to shouldComponentUpdate that returns a boolean value to determine whether or not the component should update
  // @param nextProps OBJECT: the updated values for the component's props that will be examined to see if it should re-render
  // @param nextState OBJECT: the updated values for the component's state that will be examined to see if it should re-render
  shouldComponentUpdate: function (nextProps, nextState) {
    // get mutableTraits
    var mutableTraits = this.constructor.__tuxxMutableTraits__;

    invariant(mutableTraits, 'The __tuxxMutableTraits__ property is not defined on the component.');

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
        // group nextProps and nextState into the same object to allow easy transversal down key paths stored in __tuxxMutableTraits__
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
