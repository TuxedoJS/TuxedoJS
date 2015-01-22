'use strict';

var moduleToTest = 'tuxx/src/TuxxMutableClass';

jest.dontMock(moduleToTest);

describe('TuxxMutableClass', function () {
  var owneeClass, createMutableClass, tuxxMutableClass, mockMutableClassProps, mockMixins, mockMutableRenderMixin, mockPureRenderMixin;

  beforeEach(function () {
    // Reset TuxxMutableClass and mocks before each test
    owneeClass = require('../TuxxOwneeClass');
    createMutableClass = require(moduleToTest);
    mockMutableRenderMixin = require('../TuxxMutableRenderMixin');
    mockPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
    mockMixins = [{}, {}];
    mockMutableClassProps = {
      someMockProp: {}
    };

    // Create for each test
    tuxxMutableClass = createMutableClass(mockMutableClassProps);
  });

  describe('createMutableClass', function () {
    it('should invoke owneeClass with the passed in props', function () {
      var someMockProp = owneeClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toBe(mockMutableClassProps.someMockProp);
    });

    it('should invoke owneeClass with a copy of the passed in object but not the object itself', function () {
      var mutableClassProps = owneeClass.mock.calls[0][0];
      expect(mutableClassProps).not.toBe(mockMutableClassProps);
    });

    it('should add PureRenderMixin if mutableTraits is not defined', function () {
      var pureRenderMixin = owneeClass.mock.calls[0][0].mixins[0];
      expect(pureRenderMixin).toBe(mockPureRenderMixin);
    });

    it('should add MutableRenderMixin if mutableTraits is defined', function () {
      mockMutableClassProps.mutableTraits = {};
      tuxxMutableClass = createMutableClass(mockMutableClassProps);
      var mutableRenderMixin = owneeClass.mock.calls[1][0].mixins[0];
      expect(mutableRenderMixin).toBe(mockMutableRenderMixin);
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      // Add mock passed in mixins
      mockMutableClassProps.mixins = mockMixins;
      tuxxMutableClass = createMutableClass(mockMutableClassProps);
      var mixins = owneeClass.mock.calls[1][0].mixins;
      // It should not be the original mixin array but should have its properties
      expect(mixins).not.toBe(mockMixins);
      expect(mixins[mixins.length - 2]).toBe(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toBe(mockMixins[1]);
    });
  });
});
