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
      expect(tuxActionCategory.__category__).toEqual('tests');
      expect(tuxActionCategory.__source__).toEqual('test_source');

      //individiual actions in category
      expect(tuxActionCategory.get).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.get.type).toEqual('tests_get');

      expect(tuxActionCategory.set).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.set.type).toEqual('tests_set');

      expect(tuxActionCategory.test_action).toEqual(jasmine.any(Function));
      expect(tuxActionCategory.test_action.type).toEqual('tests_test_action');

      expect(tuxActionCategory[weirdCharAction]).toEqual(jasmine.any(Function));
      expect(tuxActionCategory[weirdCharAction].type).toEqual('tests_' + weirdCharAction);
    });

    it('should assign the action category to TuxActions at the key of the category string', function () {
      expect(TuxActions.tests).toEqual(tuxActionCategory);
    });

    it('should throw an error if the same category is created twice', function () {
      expect(function () {
        TuxActions.createActionCategory(actionCategory);
      }).toThrow(new Error('Action Category "tests" is already defined'));
    });

    describe('actionCategory', function () {
      it('should dispatch an action when the associated action is invoked', function () {
        var testBody = {};
        tuxActionCategory.get(testBody);

        //method should invoke the dispatch method on the Dispatcher
        var payload = TuxActions.__Dispatcher__.dispatch.mock.calls[0][0];
        expect(payload.source).toEqual('test_source');
        expect(payload.action.actionType).toEqual('tests_get');
        expect(payload.action.body).toEqual(testBody);

        var newTestBody = {};
        tuxActionCategory.set(newTestBody);

        //method should invoke the dispatch method with a new set of parameters
        payload = TuxActions.__Dispatcher__.dispatch.mock.calls[1][0];
        expect(payload.source).toEqual('test_source');
        expect(payload.action.actionType).toEqual('tests_set');
        expect(payload.action.body).toEqual(newTestBody);
      });

      it('should register its own action category when register is invoked', function () {
        //mocking out register method since actionCategory register is just a wrapper for Actions.register
        TuxActions.register = jest.genMockFunction();

        var actionListeners = {
          get: function(){},
          set: function(){}
        };

        tuxActionCategory.register(mockStore, actionListeners);

        expect(TuxActions.register.mock.calls[0][0]).toEqual(mockStore);
        //expecting to find actionListeners under the CATEGORY key
        expect(TuxActions.register.mock.calls[0][1].tests).toEqual(actionListeners);
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
      expect(mockGet.mock.calls[0][0]).toEqual(mockBody);
      expect(mockGet.mock.calls[0][1]).toEqual(payload);

      //make sure mockWeird was not called
      expect(mockWeird.mock.calls.length).toEqual(0);

      //test weirdCharAction
      TuxActions.tests[weirdCharAction](mockBody);
      payload = TuxActions.__Dispatcher__.dispatch.mock.calls[1][0];
      TuxActions.__Dispatcher__.register.mock.calls[0][0](payload);

      //expect mocked weird function to have received payload body and payload
      expect(mockWeird.mock.calls[0][0]).toEqual(mockBody);
      expect(mockWeird.mock.calls[0][1]).toEqual(payload);

      //make sure mockGet was not called again
      expect(mockGet.mock.calls.length).toEqual(1);
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
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(0);
      expect(mockGetTwo.mock.calls.length).toEqual(0);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a weird for tests
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.tests[weirdCharAction].type
        }
      });

      //expect only mockWeird to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(0);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a getTwo for testsTwo
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.testsTwo.getTwo.type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(1);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a weird for testsTwo
      TuxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: TuxActions.testsTwo[weirdCharAction].type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(1);
      expect(mockWeirdTwo.mock.calls.length).toEqual(1);
    });

    it('should throw an error when the category does not have the desired action', function () {
      expect(function () {
        TuxActions.register(mockStore, {
          'tests': {
            'get': function () {},
            'doesntHave': function () {}
          }
        });
      }).toThrow(new Error('"tests" category does not have action "doesntHave"'));
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
      }).toThrow(new Error('"doesntHave" category has not been created yet'));
    });
  });
});
