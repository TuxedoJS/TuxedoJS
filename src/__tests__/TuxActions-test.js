'use strict';

var moduleToTest = '../TuxActions.js';

jest.dontMock(moduleToTest);

describe('TuxActions', function () {
  var TuxActions, tuxActionCategory, mockStore, mockBody;

  //action class to use for testing
  var weirdCharAction = '\'{}/187&%__  .,.#""';
  var actionCategory = {
    category: 'tests',
    source: 'test_source',
    actions: ['get', 'set', 'test_action', weirdCharAction]
  };

  beforeEach(function () {
    //reset TuxActions and mocks before each test
    TuxActions = require(moduleToTest);
    mockStore = {};
    mockBody = {};

    //create new action category for each test
    tuxActionCategory = TuxActions.createActionCategory(actionCategory);
  });

  describe('createActionCategory', function () {
    it('should return an action category with defined props', function () {
      //category properties
      expect(tuxActionCategory.__category__).toBe('tests');
      expect(tuxActionCategory.__source__).toBe('test_source');

      //individiual actions in category
      expect(tuxActionCategory.get).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.get.type).toBe('tests_get');

      expect(tuxActionCategory.set).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.set.type).toBe('tests_set');

      expect(tuxActionCategory.test_action).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.test_action.type).toBe('tests_test_action');

      expect(tuxActionCategory[weirdCharAction]).toEqual(jasmine.any(Function));
      expect(tuxActionCategory[weirdCharAction].type).toBe('tests_' + weirdCharAction);
    });

    it('should assign the action category to TuxActions at the key of the category string', function () {
      expect(TuxActions.tests).toBe(tuxActionCategory);
    });

    it('should throw an error if the same category is created twice', function () {
      expect(function () {
        TuxActions.createActionCategory(actionCategory);
      }).toThrow(new Error('Invariant Violation: Action Category "tests" is already defined'));
    });

    describe('actionCategory', function () {
      it('should dispatch an action when the associated action is invoked', function () {
        var testBody = {};
        tuxActionCategory.get(testBody);

        //method should invoke the dispatch method on the Dispatcher
        var payload = TuxActions.__Dispatcher__.dispatch.mock.calls[0][0];
        expect(payload.source).toBe('test_source');
        expect(payload.action.actionType).toBe('tests_get');
        expect(payload.action.body).toBe(testBody);

        var newTestBody = {};
        tuxActionCategory.set(newTestBody);

        //method should invoke the dispatch method with a new set of parameters
        payload = TuxActions.__Dispatcher__.dispatch.mock.calls[1][0];
        expect(payload.source).toBe('test_source');
        expect(payload.action.actionType).toBe('tests_set');
        expect(payload.action.body).toBe(newTestBody);
      });

      it('should register its own action category when register is invoked', function () {
        //mocking out register method since actionCategory register is just a wrapper for Actions.register
        TuxActions.register = jest.genMockFunction();

        var actionListeners = {
          get: function(){},
          set: function(){}
        };

        tuxActionCategory.register(mockStore, actionListeners);

        expect(TuxActions.register.mock.calls[0][0]).toBe(mockStore);
        //expecting to find actionListeners under the CATEGORY key
        expect(TuxActions.register.mock.calls[0][1].tests).toBe(actionListeners);
      });

      describe('before', function () {
        it('should add a callback to be invoked before the corresponding action is dispatched and should receive the next callback to invoke and the current actionBody (passed in by original action method or previous callback) as inputs', function () {
          //store a reference to the current get action and mock it out
          var dispatchGetAction = tuxActionCategory.get = jest.genMockFunction();

          var mockBeforeAction = jest.genMockFunction();
          tuxActionCategory.before('get', mockBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxActionCategory.get(mockActionBody);

          //expect the mockBeforeAction to have been called with the dispatchGetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[0][0]).toBe(dispatchGetAction);
          expect(mockBeforeAction.mock.calls[0][1]).toBe(mockActionBody);

          //expect the dispatchGetAction not to have been called
          expect(dispatchGetAction).not.toBeCalled();
        });

        it('should allow adding multiple callbacks and should invoke the last added callback when the action is invoked', function () {
          //store reference to original get method for testing later on
          var dispatchGetAction = tuxActionCategory.get;

          var mockBeforeAction = jest.genMockFunction();
          tuxActionCategory.before('get', mockBeforeAction);

          //store a reference to the current get method as this method is not mockBeforeAction but is instead the output of calling .bind on mockBeforeAction
          var mockBoundBeforeAction = tuxActionCategory.get;

          var mockNewBeforeAction = jest.genMockFunction();
          tuxActionCategory.before('get', mockNewBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxActionCategory.get(mockActionBody);

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
          var dispatchGetAction = tuxActionCategory.get = jest.genMockFunction();
          var dispatchSetAction = tuxActionCategory.set = jest.genMockFunction();

          var mockBeforeAction = jest.genMockFunction();
          tuxActionCategory.before(['get', 'set'], mockBeforeAction);

          //dispatch a get action with a mockActionBody
          var mockActionBody = {};
          tuxActionCategory.get(mockActionBody);

          //expect the mockBeforeAction to have been called with the dispatchGetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[0][0]).toBe(dispatchGetAction);
          expect(mockBeforeAction.mock.calls[0][1]).toBe(mockActionBody);

          //expect the dispatchGetAction not to have been called
          expect(dispatchGetAction).not.toBeCalled();

          //dispatch a set action with a mockActionBody
          mockActionBody = {};
          tuxActionCategory.set(mockActionBody);

          //expect the mockBeforeAction to have been called again with the dispatchSetAction callback and mockActionBody
          expect(mockBeforeAction.mock.calls[1][0]).toBe(dispatchSetAction);
          expect(mockBeforeAction.mock.calls[1][1]).toBe(mockActionBody);

          //expect the dispatchSetAction not to have been called
          expect(dispatchSetAction).not.toBeCalled();
        });

        it('should throw an error if the actionVerb string or one of the strings in the actionVerb array does not match an action in category', function () {
          expect(function () {
            tuxActionCategory.before('not an action', function () {});
          }).toThrow(new Error('Invariant Violation: could not find action: "not an action" within category: "tests" when attempting to register the before callback'));

          expect(function () {
            tuxActionCategory.before(['get', 'not an action'], function () {});
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
      TuxActions.register(mockStore, categoriesToRegister);
    });

    it('should attach the registration Id to the passed in store as the key of __registerId__', function () {
      expect(mockStore.hasOwnProperty('__registerId__')).toBeTruthy();
    });

    it('should invoke the corresponding function when an action is passed in', function () {
      //invoke dispatch
      TuxActions.tests.get(mockBody);

      //pull dispatched payload out of dispatcher
      var payload = TuxActions.__Dispatcher__.dispatch.mock.calls[0][0];

      //directly invoke registered cb with payload
      TuxActions.__Dispatcher__.register.mock.calls[0][0](payload);

      //expect mocked function to have received payload body and payload
      expect(mockGet.mock.calls[0][0]).toBe(mockBody);
      expect(mockGet.mock.calls[0][1]).toBe(payload);

      //make sure mockWeird was not called
      expect(mockWeird.mock.calls.length).toBe(0);

      //test weirdCharAction
      TuxActions.tests[weirdCharAction](mockBody);
      payload = TuxActions.__Dispatcher__.dispatch.mock.calls[1][0];
      TuxActions.__Dispatcher__.register.mock.calls[0][0](payload);

      //expect mocked weird function to have received payload body and payload
      expect(mockWeird.mock.calls[0][0]).toBe(mockBody);
      expect(mockWeird.mock.calls[0][1]).toBe(payload);

      //make sure mockGet was not called again
      expect(mockGet.mock.calls.length).toBe(1);
    });

    it('should handle registering multiple categories at once', function () {
      //create a new action class
      TuxActions.createActionCategory({
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
      TuxActions.register(mockStore, categoriesToRegister);

      //dispatch a get for tests
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.tests.get.type
        }
      });

      //expect only mockGet to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(0);
      expect(mockGetTwo.mock.calls.length).toBe(0);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a weird for tests
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.tests[weirdCharAction].type
        }
      });

      //expect only mockWeird to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(0);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a getTwo for testsTwo
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.testsTwo.getTwo.type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(1);
      expect(mockWeirdTwo.mock.calls.length).toBe(0);

      //dispatch a weird for testsTwo
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.testsTwo[weirdCharAction].type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toBe(1);
      expect(mockWeird.mock.calls.length).toBe(1);
      expect(mockGetTwo.mock.calls.length).toBe(1);
      expect(mockWeirdTwo.mock.calls.length).toBe(1);
    });

    it('should invoke a waitFor if the store has a __tuxArchitecture__ property', function () {
      //add tuxArchitecture property to store and register it
      mockStore.__tuxArchitecture__ = {};
      TuxActions.register(mockStore, {
        'tests': {
          get: function () {}
        }
      });
      //invoke registered cb
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({action: ''});
      //expect waitFor to be called with the tuxArchitecture
      expect(TuxActions.__Dispatcher__.waitFor.mock.calls[0][0]).toBe(mockStore.__tuxArchitecture__);
    });

    it('should throw an error when the category does not have the desired action', function () {
      expect(function () {
        TuxActions.register(mockStore, {
          'tests': {
            'get': function () {},
            'doesntHave': function () {}
          }
        });
      }).toThrow(new Error('Invariant Violation: "tests" category does not have action "doesntHave"'));
    });

    it('should throw an error when the action category does not exist', function () {
      expect(function () {
        TuxActions.register(mockStore, {
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
