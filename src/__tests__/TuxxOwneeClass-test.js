'use strict';

var moduleToTest = 'tuxx/src/TuxxOwneeClass';

jest.dontMock(moduleToTest);
jest.mock('react');

describe('TuxxOwneeClass', function () {
  var React, createOwneeClass, tuxxOwneeClass, mockOwneeClassProps, mockMixins, mockStoreMixin, mockGetOwnerPropsMixin, mockPropTypeCheckerMixin;

  beforeEach(function () {
    //reset TuxxOwneeClass and mocks before each test
    React = require('react');
    createOwneeClass = require(moduleToTest);
    mockGetOwnerPropsMixin = require('../TuxxGetOwnerPropsMixin');
    mockPropTypeCheckerMixin = require('../TuxxPropTypeCheckerMixin');
    mockStoreMixin = {};
    mockMixins = [{}, {}];
    mockOwneeClassProps = {
      someMockProp: {}
    };

    //create for each test
    tuxxOwneeClass = createOwneeClass(mockOwneeClassProps);
  });

  describe('createOwneeClass', function () {
    it('should invoke React.createClass with the passed in props', function () {
      var someMockProp = React.createClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toBe(mockOwneeClassProps.someMockProp);
    });

    it('should invoke React.createClass with a copy of the passed in object but not the object itself', function () {
      var owneeClassProps = React.createClass.mock.calls[0][0];
      expect(owneeClassProps).not.toBe(mockOwneeClassProps);
    });

    it('should add the getOwnerPropsMixin', function () {
      var getOwnerPropsMixin = React.createClass.mock.calls[0][0].mixins[0];
      expect(getOwnerPropsMixin).toBe(mockGetOwnerPropsMixin);
    });

    it('should add the propTypeCheckerMixin if nearestOwnerPropTypes key is defined', function () {
      mockOwneeClassProps.nearestOwnerPropTypes = {};
      createOwneeClass(mockOwneeClassProps);
      var propTypeCheckerMixin = React.createClass.mock.calls[1][0].mixins[1];
      expect(propTypeCheckerMixin).toBe(mockPropTypeCheckerMixin);
    });

    it('should add the propTypeCheckerMixin if anyPropTypes key is defined', function () {
      mockOwneeClassProps.anyPropTypes = {};
      createOwneeClass(mockOwneeClassProps);
      var propTypeCheckerMixin = React.createClass.mock.calls[1][0].mixins[1];
      expect(propTypeCheckerMixin).toBe(mockPropTypeCheckerMixin);
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      //add mock passed in mixins
      mockOwneeClassProps.mixins = mockMixins;
      tuxxOwneeClass = createOwneeClass(mockOwneeClassProps);
      var mixins = React.createClass.mock.calls[1][0].mixins;
      //it should not be the original mixin array but should have its properties
      expect(mixins).not.toBe(mockMixins);
      expect(mixins[mixins.length - 2]).toBe(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toBe(mockMixins[1]);
    });
  });
});
