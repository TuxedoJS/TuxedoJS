jest.dontMock('tuxx/src/TuxxStore');

describe('TuxxStore', function () {
  var TuxxStore, methods, newStore, emitChange, callbackFunc, CHANGE_EVENT, NEW_CHANGE_EVENT;

  describe('object returned by invocation', function () {

    describe('with no input arguments', function () {
      beforeEach(function () {
        TuxxStore = require('../TuxxStore')();
      });

      it('should have emitChange, addChangeListener, and removeChangeListener methods', function () {
        expect(TuxxStore.emitChange).toBeDefined();
        expect(TuxxStore.addChangeListener).toBeDefined();
        expect(TuxxStore.removeChangeListener).toBeDefined();
      });
    });

    describe('with input methods object', function () {
      beforeEach(function () {
        TuxxStore = require('../TuxxStore');
        methods = {};
      });

      it('should add user provided key value pairs to returned object', function () {
        methods.destroy = function (id) {
          delete this._messages[id];
        };

        newStore = TuxxStore(methods);
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

        newStore = TuxxStore(methods);
        expect(newStore.emitChange).not.toBe(emitChange);
        expect(newStore.emitChange).toBe(methods.emitChange);
      });
    });

    describe('emitChange, addChangeListener, and removeChangeListener methods', function () {
      beforeEach(function () {
        TuxxStore = require('../TuxxStore')();
        CHANGE_EVENT = 'CHANGE';
        NEW_CHANGE_EVENT = 'NEW_CHANGE';
        callbackFunc = function () {
          console.log('Test callback function');
        };
      });

      describe('emitChange', function () {
        it('should call emit with the default CHANGE_EVENT input', function () {
          TuxxStore.emitChange();
          expect(TuxxStore.emit).toBeCalledWith(CHANGE_EVENT);
        });

        it('should call emit with the provided CHANGE_EVENT input', function () {
          TuxxStore.emitChange(NEW_CHANGE_EVENT);
          expect(TuxxStore.emit).toBeCalledWith(NEW_CHANGE_EVENT);
        });
      });

      describe('addChangeListener', function () {
        it('should call on with default CHANGE_EVENT input and provided callback', function () {
          TuxxStore.addChangeListener(callbackFunc);
          expect(TuxxStore.on).toBeCalledWith(CHANGE_EVENT, jasmine.any(Function));
        });

        it('should call on with provided CHANGE_EVENT and provided callback', function () {
          TuxxStore.addChangeListener(callbackFunc, NEW_CHANGE_EVENT);
          expect(TuxxStore.on).toBeCalledWith(NEW_CHANGE_EVENT, jasmine.any(Function));
        });
      });

      describe('removeChangeListener', function () {
        it('should call removeListener with default CHANGE_EVENT and provided callback', function () {
          TuxxStore.removeChangeListener(callbackFunc);
          expect(TuxxStore.removeListener).toBeCalledWith(CHANGE_EVENT, jasmine.any(Function));
        });

        it('should call removeListener with provided CHANGE_EVENT and provided callback', function () {
          TuxxStore.removeChangeListener(callbackFunc, NEW_CHANGE_EVENT);
          expect(TuxxStore.removeListener).toBeCalledWith(NEW_CHANGE_EVENT, jasmine.any(Function));
        });
      });
    });
  });
});
