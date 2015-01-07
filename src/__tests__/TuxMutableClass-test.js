'use strict';

var moduleToTest = '../TuxMutableClass';

jest.mock('react');
jest.dontMock(moduleToTest);

describe('TuxMutableClass', function () {
  var React, createMutableClass, tuxMutableClass, mockMutableClassProps, mockMixins, mockGetOwnerPropsMixin, mockMutableRenderMixin, mockPureRenderMixin;

  beforeEach(function () {
    // Reset TuxMutableClass and mocks before each test
    React = require('react');
    createMutableClass = require(moduleToTest);
    mockGetOwnerPropsMixin = require('../TuxGetOwnerPropsMixin');
    mockMutableRenderMixin = require('../TuxMutableRenderMixin');
    mockPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
    mockMixins = [{}, {}];
    mockMutableClassProps = {
      someMockProp: {}
    };

    // Create for each test
    tuxMutableClass = createMutableClass(mockMutableClassProps);
  });

  describe('createMutableClass', function () {
    it('should invoke React.createClass with the passed in props', function () {
      var someMockProp = React.createClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toEqual(mockMutableClassProps.someMockProp);
    });

    it('should invoke React.createClass with a copy of the passed in object but not the object itself', function () {
      var mutableClassProps = React.createClass.mock.calls[0][0];
      expect(mutableClassProps).not.toEqual(mockMutableClassProps);
    });

    it('should add the getOwnerPropsMixin', function () {
      var getOwnerPropsMixin = React.createClass.mock.calls[0][0].mixins[0];
      expect(getOwnerPropsMixin).toEqual(mockGetOwnerPropsMixin);
    });

    it('should add PureRenderMixin if mutableTraits is not defined', function () {
      var pureRenderMixin = React.createClass.mock.calls[0][0].mixins[1];
      expect(pureRenderMixin).toEqual(mockPureRenderMixin);
    });

    it('should add MutableRenderMixin if mutableTraits is defined', function () {
      mockMutableClassProps.mutableTraits = {};
      tuxMutableClass = createMutableClass(mockMutableClassProps);
      var mutableRenderMixin = React.createClass.mock.calls[1][0].mixins[1];
      expect(mutableRenderMixin).toEqual(mockMutableRenderMixin);
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      // Add mock passed in mixins
      mockMutableClassProps.mixins = mockMixins;
      tuxMutableClass = createMutableClass(mockMutableClassProps);
      var mixins = React.createClass.mock.calls[1][0].mixins;
      // It should not be the original mixin array but should have its properties
      expect(mixins).not.toEqual(mockMixins);
      expect(mixins[mixins.length - 2]).toEqual(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toEqual(mockMixins[1]);
    });
  });
});
