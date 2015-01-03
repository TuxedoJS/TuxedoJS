'use strict';

var moduleToTest = '../TuxOwneeClass.js';

jest.dontMock(moduleToTest);
jest.mock('react');

describe('TuxOwneeClass', function () {
  var React, createOwneeClass, tuxOwneeClass, mockOwneeClassProps, mockMixins, mockStoreMixin, mockGetOwnerPropsMixin;

  beforeEach(function () {
    //reset TuxOwneeClass and mocks before each test
    React = require('react');
    createOwneeClass = require(moduleToTest);
    mockGetOwnerPropsMixin = require('../TuxGetOwnerPropsMixin.js');
    mockStoreMixin = {};
    mockMixins = [{},{}];
    mockOwneeClassProps = {
      someMockProp: {}
    };

    //create for each test
    tuxOwneeClass = createOwneeClass(mockOwneeClassProps);
  });

  describe('createOwneeClass', function () {
    it('should invoke React.createClass with the passed in props', function () {
      var someMockProp = React.createClass.mock.calls[0][0].someMockProp;
      expect(someMockProp).toEqual(mockOwneeClassProps.someMockProp);
    });

    it('should invoke React.createClass with a copy of the passed in object but not the object itself', function () {
      var owneeClassProps = React.createClass.mock.calls[0][0];
      expect(owneeClassProps).not.toEqual(mockOwneeClassProps);
    });

    it('should add the getOwnerPropsMixin', function () {
      var getOwneePropsMixin = React.createClass.mock.calls[0][0].mixins[0];
      expect(getOwneePropsMixin).toEqual(mockGetOwnerPropsMixin);
    });

    it('should add any passed in mixins after the mixins it provides', function () {
      //add mock passed in mixins
      mockOwneeClassProps.mixins = mockMixins;
      tuxOwneeClass = createOwneeClass(mockOwneeClassProps);
      var mixins = React.createClass.mock.calls[1][0].mixins;
      //it should not be the original mixin array but should have its properties
      expect(mixins).not.toEqual(mockMixins);
      expect(mixins[mixins.length - 2]).toEqual(mockMixins[0]);
      expect(mixins[mixins.length - 1]).toEqual(mockMixins[1]);
    });
  });
});
