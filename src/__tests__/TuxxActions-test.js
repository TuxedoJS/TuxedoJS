'use strict';

var moduleToTest = 'tuxx/src/TuxxActions.js';

jest.dontMock(moduleToTest);

describe('TuxxActions', function () {
  var TuxxActions, tuxxActionCategory, mockStore, mockBody;

  //action class to use for testing
  var weirdCharAction = '\'{}/187&%__  .,.#""';
  var actionCategory = {
    category: 'tests',
    source: 'test_source',
    actions: ['get', 'set', 'test_action', weirdCharAction]
  };

  beforeEach(function () {
    //reset TuxxActions and mocks before each test
    TuxxActions = require(moduleToTest);
    mockStore = {};
    mockBody = {};

    //create new action category for each test
    tuxxActionCategory = TuxxActions.createActionCategory(actionCategory);
  });

  describe('createActionCategory', function () {
    it('should return an action category with defined props', function () {
      //category properties
      expect(tuxxActionCategory.__category__).toBe('tests');
      expect(tuxxActionCategory.__source__).toBe('test_source');

      //individiual actions in category
      expect(tuxxActionCategory.get).toEqual(jasmine.any(Function));
      expect(tuxxActionCategory.get.type).toBe('tests_get');

      expect(tuxxActionCategory.set).toEqual(jasmine.any(Function));
      expect(tuxxActionCategory.set.type).toBe('tests_set');

      expect(tuxxActionCategory.test_action).toEqual(jasmine.any(Function));
      expect(tuxxActionCategory.test_action.type).toBe('tests_test_action');

      expect(tuxxActionCategory[weirdCharAction]).toEqual(jasmine.any(Function));
      expect(tuxxActionCategory[weirdCharAction].type).toBe('tests_' + weirdCharAction);
    });

    it('should assign the action category to TuxxActions at the key of the category string', function () {
      expect(TuxxActions.tests).toBe(tuxxActionCategory);
    });

    it('should throw an error if the same category is created twice', function () {
      expect(function () {
        TuxxActions.createActionCategory(actionCategory);
      }).toThrow(new Error('Invariant Violation: Action Category "tests" is already defined'));
    });

    describe('actionCategory', function () {
      it('should dispatch an action when the associated action is invoked', function () {
        var testBody = {};
        tuxxActionCategory.get(testBody);

        //method should invoke the dispatch method on the Dispatcher
        var payload = TuxxActions.__Dispatcher__.dispatch.mock.calls[0][0];
        expect(payload.source).toBe('test_source');
        expect(payload.action.actionType).toBe('tests_get');
        expect(payload.action.body).toBe(testBody);

        var newTestBody = {};
        tuxxActionCategory.set(newTestBody);

        //method should invoke the dispatch method with a new set of parameters
        payload = TuxxActions.__Dispatcher__.dispatch.mock.calls[1][0];
        expect(payload.source).toBe('test_source');
        expect(payload.action.actionType).toBe('tests_set');
        expect(payload.action.body).toBe(newTestBody);
      });

      it('should register its own action category when register is invoked', function () {
        //mocking out register method since actionCategory register is just a wrapper for Actions.register
        TuxxActions.register = jest.genMockFunction();

        var actionListeners = {
          get: function(){},
          set: function(){}
        };

        tuxxActionCategory.register(mockStore, actionListeners);

        expect(TuxxActions.register.mock.calls[0][0]).toBe(mockStore);
        //expecting to find actionListeners under the CATEGORY key
        expect(TuxxActions.register.mock.calls[0][1].tests).toBe(actionListeners);
      });

      describe('before', function () {
        it('should add a callback to be invoked before the corresponding action is dispatched and should receive the next callback to invoke and the current actionBody (passed in by original action method or previous callback) as inputs', function () {
          //store a reference to the current get action and mock it out
          var dispatchGetAction = tuxxActionCategory.get = jest.genMockFunction();

          var mockBeforeAction = jest.genMockFunction();
          tuxxActionCategory.before('get', mockBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxxActionCategory.get(mockActionBody);

          //expect the mockBeforeAction to have been called with the dispatchGetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[0][0]).toBe(dispatchGetAction);
          expect(mockBeforeAction.mock.calls[0][1]).toBe(mockActionBody);

          //expect the dispatchGetAction not to have been called
          expect(dispatchGetAction).not.toBeCalled();
        });

        it('should allow adding multiple callbacks and should invoke the last added callback when the action is invoked', function () {
          //store reference to original get method for testing later on
          var dispatchGetAction = tuxxActionCategory.get;

          var mockBeforeAction = jest.genMockFunction();
          tuxxActionCategory.before('get', mockBeforeAction);

          //store a reference to the current get method as this method is not mockBeforeAction but is instead the output of calling .bind on mockBeforeAction
          var mockBoundBeforeAction = tuxxActionCategory.get;

          var mockNewBeforeAction = jest.genMockFunction();
          tuxxActionCategory.before('get', mockNewBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxxActionCategory.get(mockActionBody);

          //expect the mockNewBeforeAction to have been called with the mockBoundBeforeAction callback and mockActionBody
          expect(mockNewBeforeAction.mock.calls[0][0]).toBe(mockBoundBeforeAction);
          expect(mockNewBeforeAction.mock.calls[0][1]).toBe(mockActionBody);

          //expect the mockBeforeAction not to be called
          expect(mockBeforeAction).not.toBeCalled();

          //invoke the first argument passed into the mockNewBeforeActio and pass in a newMockActionBody to it
          var newMockActionBody = {};
          mockNewBeforeAction.mock.calls[0][0](newMockActionBody);

          //expect the mockBeforeAction to have been called with the dispatchGetAction callback and newMockActionBody
          expect(mockBeforeAction.mock.calls[0][0]).toBe(dispatchGetAction);
          expect(mockBeforeAction.mock.calls[0][1]).toBe(newMockActionBody);
        });

        it('should accept an array of action verbs and should add the callback to be invoked to each one of them', function () {
          //store a reference to the current get and set actions
          var dispatchGetAction = tuxxActionCategory.get = jest.genMockFunction();
          var dispatchSetAction = tuxxActionCategory.set = jest.genMockFunction();

          var mockBeforeAction = jest.genMockFunction();
          tuxxActionCategory.before(['get', 'set'], mockBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxxActionCategory.get(mockActionBody);

          //expect the mockBeforeAction to have been called with the dispatchGetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[0][0]).toBe(dispatchGetAction);
          expect(mockBeforeAction.mock.calls[0][1]).toBe(mockActionBody);

          //expect the dispatchGetAction not to have been called
          expect(dispatchGetAction).not.toBeCalled();

          //dispatch a set action with a mockActionBody
          mockActionBody = {};
          tuxxActionCategory.set(mockActionBody);

          //expect the mockBeforeAction to have been called again with the dispatchSetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[1][0]).toBe(dispatchSetAction);
          expect(mockBeforeAction.mock.calls[1][1]).toBe(mockActionBody);

          //expect the dispatchSetAction not to have been called
          expect(dispatchSetAction).not.toBeCalled();
        });

        it('should throw an error if the actionVerb string or one of the strings in the actionVerb array does not match an action in category', function () {
          expect(function () {
            tuxxActionCategory.before('not an action', function () {});
          }).toThrow(new Error('Invariant Violation: could not find action: "not an action" within category: "tests" when attempting to register the before callback'));

          expect(function () {
            tuxxActionCategory.before(['get', 'not an action'], function () {});
          }).toThrow(new Error('Invariant Violation: could not find action: "not an action" within category: "tests" when attempting to register the before callback'));
        });
      });
    });
  });

  describe('register', function () {
    var mockGet, mockGetTwo, mockWeird, mockWeirdTwo, categoriesToRegister;

    //register mock category
    beforeEach(function () {
      //reinstantiate mock functions before each test
      mockGet = jest.genMockFunction();
      mockGetTwo = jest.genMockFunction();
      mockWeird = jest.genMockFunction();
      mockWeirdTwo = jest.genMockFunction();

      //register listeners on actions within category object
      categoriesToRegister = {
        'tests': {
          'get': mockGet
        }
      };
      categoriesToRegister.tests[weirdCharAction] = mockWeird;
      TuxxActions.register(mockStore, categoriesToRegister);
    });

    it('should attach the registration Id to the passed in store as the key of __registerId__', function () {
      expect(mockStore.hasOwnProperty('__registerId__')).toBeTruthy();
    });

    it('should invoke the corresponding function when an action is passed in', function () {
      //invoke dispatch
      TuxxActions.tests.get(mockBody);

      //pull dispatched payload out of dispatcher
      var payload = TuxxActions.__Dispatcher__.dispatch.mock.calls[0][0];

      //directly invoke registered cb with payload
      TuxxActions.__Dispatcher__.register.mock.calls[0][0](payload);

      //expect mocked function to have received payload body and payload
      expect(mockGet.mock.calls[0][0]).toBe(mockBody);
      expect(mockGet.mock.calls[0][1]).toBe(payload);

      //make sure mockWeird was not called
      expect(mockWeird.mock.calls.length).toBe(0);

      //test weirdCharAction
      TuxxActions.tests[weirdCharAction](mockBody);
      payload = TuxxActions.__Dispatcher__.dispatch.mock.calls[1][0];
      TuxxActions.__Dispatcher__.register.mock.calls[0][0](payload);

      //expect mocked weird function to have received payload body and payload
      expect(mockWeird.mock.calls[0][0]).toBe(mockBody);
      expect(mockWeird.mock.calls[0][1]).toBe(payload);

      //make sure mockGet was not called again
      expect(mockGet.mock.calls.length).toBe(1);
    });

    it('should handle registering multiple categories at once', function () {
      //create a new action class
      TuxxActions.createActionCategory({
        category: 'testsTwo',
        source: 'testTwo_source',
        actions: ['getTwo', 'setTwo', 'test_action', weirdCharAction]
      });

      //register both categories together
      var categoriesToRegister = {
        'tests': {
          'get': mockGet
        },
        'testsTwo': {
          'getTwo': mockGetTwo,
        }
      };
      categoriesToRegister.tests[weirdCharAction] = mockWeird;
      categoriesToRegister.testsTwo[weirdCharAction] = mockWeirdTwo;
      TuxxActions.register(mockStore, categoriesToRegister);

      //dispatch a get for tests
      TuxxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxxActions.tests.get.type
        }
      });

      //expect only mockGet to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(0);
      expect(mockGetTwo.mock.calls.length).toBe(0);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a weird for tests
      TuxxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxxActions.tests[weirdCharAction].type
        }
      });

      //expect only mockWeird to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(0);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a getTwo for testsTwo
      TuxxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxxActions.testsTwo.getTwo.type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(1);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a weird for testsTwo
      TuxxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxxActions.testsTwo[weirdCharAction].type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(1);
      expect(mockWeirdTwo.mock.calls.length).toBe(1);
    });

    it('should invoke a waitFor if the store has a __tuxxArchitecture__ property', function () {
      //add tuxxArchitecture property to store and register it
      mockStore.__tuxxArchitecture__ = {};
      TuxxActions.register(mockStore, {
        'tests': {
          get: function () {}
        }
      });
      //invoke registered cb
      TuxxActions.__Dispatcher__.register.mock.calls[1][0]({action: ''});
      //expect waitFor to be called with the tuxxArchitecture
      expect(TuxxActions.__Dispatcher__.waitFor.mock.calls[0][0]).toBe(mockStore.__tuxxArchitecture__);
    });

    it('should throw an error when the category does not have the desired action', function () {
      expect(function () {
        TuxxActions.register(mockStore, {
          'tests': {
            'get': function () {},
            'doesntHave': function () {}
          }
        });
      }).toThrow(new Error('Invariant Violation: "tests" category does not have action "doesntHave"'));
    });

    it('should throw an error when the action category does not exist', function () {
      expect(function () {
        TuxxActions.register(mockStore, {
          'tests': {
            'get': function () {}
          },
          'doesntHave': {
            'get': function () {}
          }
        });
      }).toThrow(new Error('Invariant Violation: "doesntHave" category has not been created yet'));
    });
  });
});
