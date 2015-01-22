'use strict';

var moduleToTest = 'tuxx/src/TuxxActionStore';

jest.dontMock(moduleToTest);

describe('TuxxActionStore', function () {
  var Actions, TuxxStore, TuxxActionStore, mockMethods, actionStore, mockActionCallbacks, context, mockRegisterFunction;

  beforeEach(function () {
    //reset required modules and mocks
    Actions = require('tuxx/Actions');
    TuxxStore = require('tuxx/Stores').createStore;
    TuxxActionStore = require(moduleToTest);

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

    //mock our TuxxStore return
    TuxxStore.mockReturnValue({});
    //call TuxxActionStore with our mockMethods
    actionStore = TuxxActionStore(mockMethods);
  });

  it('should invoke the TuxxStore function with the passed in object', function () {
    expect(TuxxStore.mock.calls[0][0]).toBe(mockMethods);
  });

  it('should invoke tuxx/Actions with the actionStore and the result of the function at the register key.  The function should have a context of the actionStore', function () {
    //expect Actions.register to be invoked with actionStore, mockActionCallbacks
    expect(Actions.register.mock.calls[0][0]).toBe(actionStore);
    expect(Actions.register.mock.calls[0][1]).toBe(mockActionCallbacks);
    //expect our context to be the actionStore
    expect(context).toBe(actionStore);
  });
});
