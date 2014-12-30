'use strict';

var moduleToTest = '../FluxActions.js';

jest.dontMock(moduleToTest);

describe('FluxActions', function () {
  var FluxActions;
  var fluxActionCategory;
  var weirdCharAction = '\'{}/187&%__  .,.#""';
  var mockStore, mockBody;
  var actionClass = {
    category: 'tests',
    source: 'test_source',
    actions: ['get', 'set', 'test_action', weirdCharAction]
  };

  beforeEach(function () {
    //reset FluxActions after each test
    FluxActions = require(moduleToTest);
    mockStore = {};
    mockBody = {};
    //create new action category for each test
    fluxActionCategory = FluxActions.createActionClass(actionClass);
  });

  //  createActionClass
  //should allow the user to create a category of actions
  describe('createActionClass', function () {

    it('should return an action category with defined props', function () {

      expect(fluxActionCategory.__category__).toEqual('tests');
      expect(fluxActionCategory.__source__).toEqual('test_source');
      expect(fluxActionCategory.get).toEqual(jasmine.any(Function));
      expect(fluxActionCategory.get.type).toEqual('tests_get');
      expect(fluxActionCategory.set).toEqual(jasmine.any(Function));
      expect(fluxActionCategory.set.type).toEqual('tests_set');
      expect(fluxActionCategory.test_action).toEqual(jasmine.any(Function));
      expect(fluxActionCategory.test_action.type).toEqual('tests_test_action');
      expect(fluxActionCategory[weirdCharAction]).toEqual(jasmine.any(Function));
      expect(fluxActionCategory[weirdCharAction].type).toEqual('tests_' + weirdCharAction);

    });

    it('should assign the action category to FluxActions at the key of the category string', function () {

      expect(FluxActions.tests).toEqual(fluxActionCategory);

    });

    it('should throw an error if the same category is created twice', function () {

      expect(function () {
        FluxActions.createActionClass(actionClass);
      }).toThrow(new Error('Action Category is already defined'));

    });

    describe('actionCategory', function () {

      it('should dispatch an action when the associated action is invoked', function () {

        var testBody = {};
        fluxActionCategory.get(testBody);
        var payload = FluxActions.__Dispatcher__.dispatch.mock.calls[0][0];
        expect(payload.source).toEqual('test_source');
        expect(payload.action.actionType).toEqual('tests_get');
        expect(payload.action.body).toEqual(testBody);

        var newTestBody = {};
        fluxActionCategory.set(newTestBody);
        payload = FluxActions.__Dispatcher__.dispatch.mock.calls[1][0];
        expect(payload.source).toEqual('test_source');
        expect(payload.action.actionType).toEqual('tests_set');
        expect(payload.action.body).toEqual(newTestBody);

      });

      it('should register its own action category when register is invoked', function () {

        //mocking out register method since actionCategory register is just a wrapper for actions register
        FluxActions.register = jest.genMockFunction();

        var actionListeners = {
          get: function(){},
          set: function(){}
        };

        fluxActionCategory.register(mockStore, actionListeners);

        expect(FluxActions.register.mock.calls[0][0]).toEqual(mockStore);
        expect(FluxActions.register.mock.calls[0][1].tests).toEqual(actionListeners);

      });

    });

  });

  //  register
  //should register actions with the dispatcher
  describe('register', function () {
    var mockGet, mockGetTwo, mockWeird, mockWeirdTwo;
    var categoriesToRegister;

    //register mock category
    beforeEach(function () {
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
      FluxActions.register(mockStore, categoriesToRegister);
    });

    it('should attach the registration Id to the passed in store as the key of __registerId__', function () {

      expect(mockStore.hasOwnProperty('__registerId__')).toBeTruthy();

    });

    it('should invoke the corresponding function when an action is passed in', function () {

      //invoke dispatch
      FluxActions.tests.get(mockBody);
      //pull dispatched payload out of dispatcher
      var payload = FluxActions.__Dispatcher__.dispatch.mock.calls[0][0];
      //directly invoke registered cb with payload
      FluxActions.__Dispatcher__.register.mock.calls[0][0](payload);
      //expect mocked function to have received payload body and payload
      expect(mockGet.mock.calls[0][0]).toEqual(mockBody);
      expect(mockGet.mock.calls[0][1]).toEqual(payload);
      //make sure mockWeird was not called
      expect(mockWeird.mock.calls.length).toEqual(0);

      //test weirdCharAction
      FluxActions.tests[weirdCharAction](mockBody);
      payload = FluxActions.__Dispatcher__.dispatch.mock.calls[1][0];
      FluxActions.__Dispatcher__.register.mock.calls[0][0](payload);
      expect(mockWeird.mock.calls[0][0]).toEqual(mockBody);
      expect(mockWeird.mock.calls[0][1]).toEqual(payload);
      //make sure mockGet was not called again
      expect(mockGet.mock.calls.length).toEqual(1);

    });

    it('should handle registering multiple categories at once', function () {

      //create a new action class
      FluxActions.createActionClass({
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
      FluxActions.register(mockStore, categoriesToRegister);

      //dispatch a get for tests
      FluxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: FluxActions.tests.get.type
        }
      });

      //expect only mockGet to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(0);
      expect(mockGetTwo.mock.calls.length).toEqual(0);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a weird for tests
      FluxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: FluxActions.tests[weirdCharAction].type
        }
      });

      //expect only mockWeird to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(0);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a getTwo for testsTwo
      FluxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: FluxActions.testsTwo.getTwo.type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(1);
      expect(mockWeirdTwo.mock.calls.length).toEqual(0);

      //dispatch a weird for testsTwo
      FluxActions.__Dispatcher__.register.mock.calls[1][0]({
        action: {
          actionType: FluxActions.testsTwo[weirdCharAction].type
        }
      });

      //expect only mockGetTwo to have been called
      expect(mockGet.mock.calls.length).toEqual(1);
      expect(mockWeird.mock.calls.length).toEqual(1);
      expect(mockGetTwo.mock.calls.length).toEqual(1);
      expect(mockWeirdTwo.mock.calls.length).toEqual(1);

    });

  });

});
