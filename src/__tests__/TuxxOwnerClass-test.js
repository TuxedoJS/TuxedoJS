'use strict';

var moduleToTest = 'tuxx/src/TuxxOwnerClass';

jest.dontMock(moduleToTest);

describe('TuxxOwnerClass', function () {
  var owneeClass, createOwnerClass, tuxxOwnerClass, mockOwnerClassProps, mockMixins, mockConnectOwnerToStore, mockStoreMixinGenerator, mockStoreMixin;

  beforeEach(function () {
    //reset TuxxOwnerClass and mocks before each test
    owneeClass = require('../TuxxOwneeClass');
    createOwnerClass = require(moduleToTest);
    mockStoreMixinGenerator = require('../TuxxStoreMixinGenerator');
    mockStoreMixin = {};
    mockMixins = [{}, {}];
    mockConnectOwnerToStore = {};
    mockOwnerClassProps = {
      someMockProp: {}
    };

    //create for each test
    tuxxOwnerClass = createOwnerClass(mockOwnerClassProps);
  });

  describe('createOwnerClass', function () {
    it('should invoke owneeClass with the passed in props', function () {
      var someMockProp = owneeClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toBe(mockOwnerClassProps.someMockProp);
    });

    it('should invoke owneeClass with a copy of the passed in object but not the object itself', function () {
      var ownerClassProps = owneeClass.mock.calls[0][0];
      expect(ownerClassProps).not.toBe(mockOwnerClassProps);
    });

    it('should attach the __tuxxIsOwnerComponent__ prop', function () {
      var __tuxxIsOwnerComponent__ = owneeClass.mock.calls[0][0].__tuxxIsOwnerComponent__;
      expect(__tuxxIsOwnerComponent__).toBeTruthy();
    });

    it('should invoke storeMixinGenerator with the connectOwnerToStore key', function () {
      //mock out the store mixin generator return value
      mockStoreMixinGenerator.mockReturnValueOnce(mockStoreMixin);
      //add the mock connect owner to store property
      mockOwnerClassProps.connectOwnerToStore = mockConnectOwnerToStore;
      tuxxOwnerClass = createOwnerClass(mockOwnerClassProps);
      //expect the mock for store mixin generator to have been called and expect the result to have been mixed in to the return React class
      expect(mockStoreMixinGenerator.mock.calls[0][0]).toBe(mockConnectOwnerToStore);
      var mixins = owneeClass.mock.calls[1][0].mixins;
      expect(mixins[0]).toBe(mockStoreMixin);
    });

    it('should not invoke storeMixinGenerator if the key connectOwnerToStore is not passed in', function () {
      expect(mockStoreMixinGenerator).not.toBeCalled();
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      //add the mock connect owner to store property
      mockOwnerClassProps.connectOwnerToStore = mockConnectOwnerToStore;
      //add mock passed in mixins
      mockOwnerClassProps.mixins = mockMixins;
      tuxxOwnerClass = createOwnerClass(mockOwnerClassProps);
      var mixins = owneeClass.mock.calls[1][0].mixins;
      //it should not be the original mixin array but should have its properties
      expect(mixins).not.toBe(mockMixins);
      expect(mixins[mixins.length - 2]).toBe(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toBe(mockMixins[1]);
    });
  });
});
