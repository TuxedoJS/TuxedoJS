jest.dontMock('tux/src/TuxStore');

describe('TuxStore', function () {
  var TuxStore, methods, newStore, emitChange, callbackFunc, CHANGE_EVENT, NEW_CHANGE_EVENT;

  describe('object returned by invocation', function () {

    describe('with no input arguments', function () {
      beforeEach(function () {
        TuxStore = require('../TuxStore')();
      });

      it('should have emitChange, addChangeListener, and removeChangeListener methods', function () {
        expect(TuxStore.emitChange).toBeDefined();
        expect(TuxStore.addChangeListener).toBeDefined();
        expect(TuxStore.removeChangeListener).toBeDefined();
      });
    });

    describe('with input methods object', function () {
      beforeEach(function () {
        TuxStore = require('../TuxStore');
        methods = {};
      });

      it('should add user provided key value pairs to returned object', function () {
        methods.destroy = function (id) {
          delete this._messages[id];
        };

        newStore = TuxStore(methods);
        expect(newStore.destroy).toBe(methods.destroy);
      });

      it('should overwrite original methods that have the same name with input methods', function () {
        emitChange = function (CHANGE_EVENT) {
          CHANGE_EVENT = CHANGE_EVENT || 'CHANGE';
          this.emit(CHANGE_EVENT);
        };

        methods.emitChange = function (different) {
          console.log('Should be different now!');
        };

        newStore = TuxStore(methods);
        expect(newStore.emitChange).not.toBe(emitChange);
        expect(newStore.emitChange).toBe(methods.emitChange);
      });
    });

    describe('emitChange, addChangeListener, and removeChangeListener methods', function () {
      beforeEach(function () {
        TuxStore = require('../TuxStore')();
        CHANGE_EVENT = 'CHANGE';
        NEW_CHANGE_EVENT = 'NEW_CHANGE';
        callbackFunc = function () {
          console.log('Test callback function');
        };
      });

      describe('emitChange', function () {
        it('should call emit with the default CHANGE_EVENT input', function () {
          TuxStore.emitChange();
          expect(TuxStore.emit).toBeCalledWith(CHANGE_EVENT);
        });

        it('should call emit with the provided CHANGE_EVENT input', function () {
          TuxStore.emitChange(NEW_CHANGE_EVENT);
          expect(TuxStore.emit).toBeCalledWith(NEW_CHANGE_EVENT);
        });
      });

      describe('addChangeListener', function () {
        it('should call on with default CHANGE_EVENT input and provided callback', function () {
          TuxStore.addChangeListener(callbackFunc);
          expect(TuxStore.on).toBeCalledWith(CHANGE_EVENT, jasmine.any(Function));
        });

        it('should call on with provided CHANGE_EVENT and provided callback', function () {
          TuxStore.addChangeListener(callbackFunc, NEW_CHANGE_EVENT);
          expect(TuxStore.on).toBeCalledWith(NEW_CHANGE_EVENT, jasmine.any(Function));
        });
      });

      describe('removeChangeListener', function () {
        it('should call removeListener with default CHANGE_EVENT and provided callback', function () {
          TuxStore.removeChangeListener(callbackFunc);
          expect(TuxStore.removeListener).toBeCalledWith(CHANGE_EVENT, jasmine.any(Function));
        });

        it('should call removeListener with provided CHANGE_EVENT and provided callback', function () {
          TuxStore.removeChangeListener(callbackFunc, NEW_CHANGE_EVENT);
          expect(TuxStore.removeListener).toBeCalledWith(NEW_CHANGE_EVENT, jasmine.any(Function));
        });
      });
    });
  });
});
