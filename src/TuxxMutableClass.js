'use strict';

var owneeClass = require('tuxx/src/TuxxOwneeClass');
var pureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var mutableRenderMixin = require('tuxx/src/TuxxMutableRenderMixin');
var assign = require('object-assign');

// createMutableClass FUNCTION: creates a mutable Tuxx Class which is a type of React class designed to compare specified mutable traits to determine if a component should re-render
// @param mutableClassProps OBJECT: properties that the new mutableClass will possess, should be a standard React.createClass object with properties such as componentWillMount, componentDidMount, etc.  Please see http://facebook.github.io/react/docs/component-specs.html for a full list of React props
  // required keys:
  // render FUNCTION: since this is an implementation of React.createClass a render method is required
  // additional keys
    // mutableTraits OBJECT: traits will be registered [ALTERNATE ARRAY: array of objects with same keys as listed below]
      // expected keys:
      // props STRING: a trait within the components props object [ALTERNATE ARRAY of trait strings to create paths for] [ALTERNATE ARRAY of ARRAYS of trait strings to create paths for]
      // state STRING: a trait within the components state object [ALTERNATE ARRAY of trait strings to create paths for] [ALTERNATE ARRAY of ARRAYS of trait strings to create paths for]
      // eg: mutableClassProps.mutableTraits => {
      //   props: 'text',
      //   state: 'editing'
      // }
      // OR
      // eg: mutableClassProps.mutableTraits => {
      //   props: ['text', 'timestamp'],
      //   state: 'editing'
      // }
      // OR it is possible to specify the hierarchy of keys to search through to improve performance of the one time deep search/provide greater specificity regarding the required property
      // eg: mutableClassProps.mutableTraits => {
      //   props: [
      //     ['message', 'text'],
      //     ['message', 'timestamp']
      //   ],
      //   state: 'editing'
      // }
var mixinsToAdd, mutableTraits, mixins;
var TuxxMutableClass = function (mutableClassProps) {
  mixinsToAdd = [];

  // if mutableTraits is defined than add the mutableRenderMixin, else use the pureRenderMixin
  mutableTraits = mutableClassProps.mutableTraits;
  if (mutableTraits) {
    mixinsToAdd.push(mutableRenderMixin);
  } else {
    mixinsToAdd.push(pureRenderMixin);
  }

  // concat any mixins passed in through mutableClassProps to mixinsToAdd.  Note that mixins is concated on to mixinsToAdd (not the other way around) so that all Tuxx mixins will be invoked first
  mixins = mutableClassProps.mixins;
  if (mixins) {
    mixinsToAdd = mixinsToAdd.concat(mixins);
  }

  //pass in props to owneeClass to get base tuxx mixins
  return owneeClass(assign({}, mutableClassProps, {
    mixins: mixinsToAdd
  }));
};

module.exports = TuxxMutableClass;
