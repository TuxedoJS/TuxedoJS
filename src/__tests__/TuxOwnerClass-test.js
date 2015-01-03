'use strict';

var moduleToTest = '../TuxOwnerClass.js';

jest.dontMock(moduleToTest);
jest.mock('react');

describe('TuxOwnerClass', function () {
  var React, createOwnerClass, tuxOwnerClass, mockOwnerClassProps, mockMixins, mockConnectOwnerToStore, mockStoreMixinGenerator, mockStoreMixin, mockGetOwnerPropsMixin;

  beforeEach(function () {
    //reset TuxOwnerClass and mocks before each test
    React = require('react');
    createOwnerClass = require(moduleToTest);
    mockStoreMixinGenerator = require('../TuxStoreMixinGenerator.js');
    mockGetOwnerPropsMixin = require('../TuxGetOwnerPropsMixin.js');
    mockStoreMixin = {};
    mockMixins = [{},{}];
    mockConnectOwnerToStore = {};
    mockOwnerClassProps = {
      someMockProp: {}
    };

    //create for each test
    tuxOwnerClass = createOwnerClass(mockOwnerClassProps);
  });

  describe('createOwnerClass', function () {
    it('should invoke React.createClass with the passed in props', function () {
      var someMockProp = React.createClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toEqual(mockOwnerClassProps.someMockProp);
    });

    it('should invoke React.createClass with a copy of the passed in object but not the object itself', function () {
      var ownerClassProps = React.createClass.mock.calls[0][0];
      expect(ownerClassProps).not.toEqual(mockOwnerClassProps);
    });

    it('should attach the __tuxIsOwnerComponent__', function () {
      var __tuxIsOwnerComponent__ = React.createClass.mock.calls[0][0].__tuxIsOwnerComponent__;
      expect(__tuxIsOwnerComponent__).toBeTruthy();
    });

    it('should add the getOwnerPropsMixin', function () {
      var getOwnerPropsMixin = React.createClass.mock.calls[0][0].mixins[0];
      expect(getOwnerPropsMixin).toEqual(mockGetOwnerPropsMixin);
    });

    it('should invoke storeMixinGenerator with the connectOwnerToStore key', function () {
      //mock out the store mixin generator return value
      mockStoreMixinGenerator.mockReturnValueOnce(mockStoreMixin);
      //add the mock connect owner to store property
      mockOwnerClassProps.connectOwnerToStore = mockConnectOwnerToStore;
      tuxOwnerClass = createOwnerClass(mockOwnerClassProps);
      //expect the mock for store mixin generator to have been called and expect the result to have been mixed in to the return React class
      expect(mockStoreMixinGenerator.mock.calls[0][0]).toEqual(mockConnectOwnerToStore);
      var mixins = React.createClass.mock.calls[1][0].mixins;
      expect(mixins[1]).toEqual(mockStoreMixin);
    });

    it('should not invoke storeMixinGenerator if the key connectOwnerToStore is not passed in', function () {
      expect(mockStoreMixinGenerator).not.toBeCalled();
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      //add the mock connect owner to store property
      mockOwnerClassProps.connectOwnerToStore = mockConnectOwnerToStore;
      //add mock passed in mixins
      mockOwnerClassProps.mixins = mockMixins;
      tuxOwnerClass = createOwnerClass(mockOwnerClassProps);
      var mixins = React.createClass.mock.calls[1][0].mixins;
      //it should not be the original mixin array but should have its properties
      expect(mixins).not.toEqual(mockMixins);
      expect(mixins[mixins.length - 2]).toEqual(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toEqual(mockMixins[1]);
    });
  });
});
