'use strict';

var moduleToTest = '../TuxActionStore';

jest.dontMock(moduleToTest);

describe('TuxActionStore', function () {
  var Actions, TuxStore, TuxActionStore, mockMethods, actionStore, mockActionCallbacks, context, mockRegisterFunction;

  beforeEach(function () {
    //reset required modules and mocks
    Actions = require('tux/Actions');
    TuxStore = require('tux/Stores').createStore;
    TuxActionStore = require(moduleToTest);

    //mock register method, returns our mockActionCallbacks and sets context for testing 'this'
    mockActionCallbacks = {};
    mockRegisterFunction = function () {
      context = this;
      return mockActionCallbacks;
    };

    //add mockRegisterFunction to mockMethods at key of register
    mockMethods = {
      register: mockRegisterFunction
    };

    //mock our TuxStore return
    TuxStore.mockReturnValue({});
    //call TuxActionStore with our mockMethods
    actionStore = TuxActionStore(mockMethods);
  });

  it('should invoke the TuxStore function with the passed in object', function () {
    expect(TuxStore.mock.calls[0][0]).toBe(mockMethods);
  });

  it('should invoke tux/Actions with the actionStore and the result of the function at the register key.  The function should have a context of the actionStore', function () {
    //expect Actions.register to be invoked with actionStore, mockActionCallbacks
    expect(Actions.register.mock.calls[0][0]).toBe(actionStore);
    expect(Actions.register.mock.calls[0][1]).toBe(mockActionCallbacks);
    //expect our context to be the actionStore
    expect(context).toBe(actionStore);
  });
});
