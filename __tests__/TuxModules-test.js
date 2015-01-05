'use strict';

//since we are testing our module structure by requiring modules we dont want those modules to be mocked out
jest.autoMockOff();
//leaving this test commented out because the test takes an extremely long time to run and could interrupt normally workflow
xdescribe('Individual Tux Modules', function () {
  describe('Actions', function () {
    it('should expose the module in tux/src/TuxActions.js', function () {
      expect(require('tux/Actions')).toEqual(require('tux/src/TuxActions'));
    });
  });

  describe('Architecture', function () {
    it('should expose the module in tux/src/TuxArchitectStores.js under the method architect', function () {
      expect(require('tux/Architecture').architect).toEqual(require('tux/src/TuxArchitectStores'));
    });
  });

  describe('Components', function () {
    it('should expose only the specific component that the user requires in', function () {
      expect(require('tux/Components/FormattedInput')).toEqual(require('react-validating-form').FormattedInput);
    });
  });

  describe('React', function () {
    it('should expose the react module', function () {
      expect(require('tux/React')).toEqual(require('react'));
    });

    it('should expose the module in tux/src/TuxOwnerClass under the method createOwnerClass', function () {
      expect(require('tux/React').createOwnerClass).toEqual(require('tux/src/TuxOwnerClass'));
    });

    it('should expose the module in tux/src/TuxOwneeClass under the method createOwneeClass', function () {
      expect(require('tux/React').createOwneeClass).toEqual(require('tux/src/TuxOwneeClass'));
    });
  });

  describe('Router', function () {
    it('should expose only the specific router component that the user requires in', function () {
      expect(require('tux/Router/Route')).toEqual(require('react-router').Route);
    });
  });

  describe('Stores', function () {
    it('should expose the module in tux/Store under the method createStore', function () {
      expect(require('tux/Stores').createStore).toEqual(require('tux/src/TuxStore'));
    });
  });

  describe('Tuxedo', function () {
    it('should log a warning if used directly', function () {
      console.warn = jest.genMockFunction();
      require('tux');
      expect(console.warn.mock.calls[0][0]).toEqual('Using the Tux object directly is not recommended as it will mean loading all modules even those you don\'t intend to use.  Please review the TuxedoJS documents for requiring only the individual pieces of TuxedoJS that you will need.');
    });
  });
});
