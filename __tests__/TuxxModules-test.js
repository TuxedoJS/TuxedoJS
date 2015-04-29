'use strict';

//since these tests are for module structure and are based on requiring modules, those modules should not be mocked out in order to make sure that the comparisons are valid
jest.autoMockOff();
describe('Individual Tuxx Modules', function () {
  describe('Actions', function () {
    it('should expose the module in tuxx/src/TuxxActions.js', function () {
      expect(require('tuxx/Actions')).toBe(require('tuxx/src/TuxxActions'));
    });
  });

  describe('Architecture', function () {
    it('should expose the module in tuxx/src/TuxxArchitectStores.js under the method architect', function () {
      expect(require('tuxx/Architecture').architect).toBe(require('tuxx/src/TuxxArchitectStores'));
    });
  });

  describe('Components', function () {
    it('should expose only the specific component that the user requires in', function () {
      expect(require('tuxx/Components/FormattedInput')).toBe(require('react-validating-form').FormattedInput);
    });
  });

  describe('React', function () {
    it('should expose the react module', function () {
      expect(require('tuxx/React')).toBe(require('react'));
    });

    it('should expose the module in tuxx/src/TuxxOwnerClass under the method createOwnerClass', function () {
      expect(require('tuxx/React').createOwnerClass).toBe(require('tuxx/src/TuxxOwnerClass'));
    });

    it('should expose the module in tuxx/src/TuxxOwneeClass under the method createOwneeClass', function () {
      expect(require('tuxx/React').createOwneeClass).toBe(require('tuxx/src/TuxxOwneeClass'));
    });

    it('should expose the module in tuxx/src/TuxxMutableClass under the method createMutableClass', function () {
      expect(require('tuxx/React').createMutableClass).toBe(require('tuxx/src/TuxxMutableClass'));
    });

    it('should expose the specific React addon that the user requires in', function () {
      expect(require('tuxx/React/LinkedStateMixin')).toBe(require('react/lib/LinkedStateMixin'));
      expect(require('tuxx/React/Perf')).toBe(require('react/lib/ReactDefaultPerf'));
    });
  });

  describe('Router', function () {
    it('should expose only the specific router component or method that the user requires in', function () {
      expect(require('tuxx/Router/DefaultRoute')).toBe(require('react-router').DefaultRoute);
      expect(require('tuxx/Router/Link')).toBe(require('react-router').Link);
      expect(require('tuxx/Router/NotFoundRoute')).toBe(require('react-router').NotFoundRoute);
      expect(require('tuxx/Router/Redirect')).toBe(require('react-router').Redirect);
      expect(require('tuxx/Router/Route')).toBe(require('react-router').Route);
      expect(require('tuxx/Router/RouteHandler')).toBe(require('react-router').RouteHandler);

      expect(require('tuxx/Router/HashLocation')).toBe(require('react-router').HashLocation);
      expect(require('tuxx/Router/HistoryLocation')).toBe(require('react-router').HistoryLocation);
      expect(require('tuxx/Router/RefreshLocation')).toBe(require('react-router').RefreshLocation);
      expect(require('tuxx/Router/StaticLocation')).toBe(require('react-router').StaticLocation);
      expect(require('tuxx/Router/TestLocation')).toBe(require('react-router').TestLocation);

      expect(require('tuxx/Router/ImitateBrowserBehavior')).toBe(require('react-router').ImitateBrowserBehavior);
      expect(require('tuxx/Router/ScrollToTopBehavior')).toBe(require('react-router').ScrollToTopBehavior);

      expect(require('tuxx/Router/History')).toBe(require('react-router').History);
      expect(require('tuxx/Router/Navigation')).toBe(require('react-router').Navigation);
      expect(require('tuxx/Router/State')).toBe(require('react-router').State);

      expect(require('tuxx/Router/createRoute')).toBe(require('react-router').createRoute);
      expect(require('tuxx/Router/createDefaultRoute')).toBe(require('react-router').createDefaultRoute);
      expect(require('tuxx/Router/createNotFoundRoute')).toBe(require('react-router').createNotFoundRoute);
      expect(require('tuxx/Router/createRedirect')).toBe(require('react-router').createRedirect);
      expect(require('tuxx/Router/createRoutesFromReactChildren')).toBe(require('react-router').createRoutesFromReactChildren);
      expect(require('tuxx/Router/create')).toBe(require('react-router').create);
      expect(require('tuxx/Router/run')).toBe(require('react-router').run);
    });
  });

  describe('Stores', function () {
    it('should expose the module in src/TuxxStore under the method createStore', function () {
      expect(require('tuxx/Stores').createStore).toBe(require('tuxx/src/TuxxStore'));
    });

    describe('ActionStores', function () {
      it('should expose the module in src/TuxxActionStore under the method createStore', function () {
        expect(require('tuxx/Stores/ActionStores').createStore).toBe(require('tuxx/src/TuxxActionStore'));
      });
    });
  });

  describe('Animations', function () {
    it('should expose the TuxxAnimations module under the createAnimation method', function () {
      expect(require('tuxx/Animations').createAnimation).toBe(require('tuxx/src/TuxxAnimations'));
    });

    it('should expose only the specific animation component that the user requires in', function () {
      expect(require('tuxx/Animations/Fly')).toBeDefined();
    });

    it('should expose only the specific sub animation component that the user requires in', function () {
      expect(require('tuxx/Animations/Fade/DownBig')).toBeDefined();
    });
  });

  describe('Tuxedo', function () {
    it('should log a warning if used directly', function () {
      console.warn = jest.genMockFunction();
      require('tuxx');
      expect(console.warn.mock.calls[0][0]).toBe('Using the Tuxx object directly is not recommended as it will mean loading all modules even those you don\'t intend to use.  Please review the TuxedoJS documents for requiring only the individual pieces of TuxedoJS that you will need.');
    });
  });
});
