'use strict';
var moduleToTest = 'tuxx/src/TuxxStoreMixinGenerator';

jest.dontMock(moduleToTest);

describe('TuxxStoreMixinGenerator', function () {
  var TuxxStoreMixinGenerator, mockStore1, mockStore2, mockListener1, mockListener2, mockListener3, mockListener4, mockEvent1, mockEvent2, mockEvent3, mockEvent4, mockConnectComposerToStore1, mockConnectComposerToStoreReturn1, mockConnectComposerToStore2, mockConnectComposerToStoreReturn2, mockMixin;

  beforeEach(function () {
    TuxxStoreMixinGenerator = require(moduleToTest);
    mockStore1 = {
      addChangeListener: jest.genMockFunction(),
      removeChangeListener: jest.genMockFunction()
    };
    mockStore2 = {
      addChangeListener: jest.genMockFunction(),
      removeChangeListener: jest.genMockFunction()
    };
    mockListener1 = jest.genMockFunction();
    mockListener2 = jest.genMockFunction();
    mockListener3 = jest.genMockFunction();
    mockListener4 = jest.genMockFunction();
    mockEvent1 = 'CHANGE1';
    mockEvent2 = 'CHANGE2';
    mockEvent3 = 'CHANGE3';
    mockEvent4 = 'CHANGE4';
    mockConnectComposerToStoreReturn1 = { store: mockStore1 };
    mockConnectComposerToStore1 = function () {
      return mockConnectComposerToStoreReturn1;
    };
    mockConnectComposerToStoreReturn2 = { store: mockStore2 };
    mockConnectComposerToStore2 = function () {
      return mockConnectComposerToStoreReturn2;
    };
  });

  it('should return an empty object when no inut argument supplied', function () {
    expect(TuxxStoreMixinGenerator()).toEqual({});
  });

  describe('mockConnectComposerToStore function', function () {
    describe('single event and listener on mockConnectComposerToStoreReturn1 object', function () {
      beforeEach(function () {
        mockConnectComposerToStoreReturn1.listener = mockListener1;
        mockConnectComposerToStoreReturn1.event = mockEvent1;
        mockMixin = TuxxStoreMixinGenerator(mockConnectComposerToStore1);
      });

      it('should return an object with componentDidMount and componentWillUnmount keys', function () {
        expect(mockMixin.componentDidMount).toBeDefined();
        expect(mockMixin.componentWillUnmount).toBeDefined();
      });

      it('should add a change listener for provided event on componentDidMount', function () {
        mockMixin.componentDidMount();
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event);
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(1);
      });

      it('should remove a change listener for provided event on componentWillUnmount', function () {
        mockMixin.componentDidMount();
        mockMixin.componentWillUnmount();
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event);
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(1);
      });
    });

    describe('more events than listeners', function () {
      beforeEach(function () {
        mockConnectComposerToStoreReturn1.listener = [mockListener1, mockListener2];
        mockConnectComposerToStoreReturn1.event = [mockEvent1, mockEvent2, mockEvent3, mockEvent4];
        mockMixin = TuxxStoreMixinGenerator(mockConnectComposerToStore1);
      });

      it('adds listeners and events one for one, until events are greater than listener length, at which point the last listener gets assigned to remaining events on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(0);
        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each mockEvent
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(4);
        // first call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

        // second call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // third call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.addChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[2]);

        // fourth call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[3][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.addChangeListener.mock.calls[3][1]).toBe(mockConnectComposerToStoreReturn1.event[3]);
      });

      it('removes the mapped change listeners to events, when there are more events than listeners, on componentWillUnmount', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(0);
        mockMixin.componentDidMount();
        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockEvent
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(4);

        // first call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

        // second call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // third call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.removeChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[2]);

        // fourth call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[3][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.removeChangeListener.mock.calls[3][1]).toBe(mockConnectComposerToStoreReturn1.event[3]);
      });
    });

    describe('more listeners than events', function () {
      beforeEach(function () {
        mockConnectComposerToStoreReturn1.listener = [mockListener1, mockListener2, mockListener3, mockListener4];
        mockConnectComposerToStoreReturn1.event = [mockEvent1, mockEvent2];
        mockMixin = TuxxStoreMixinGenerator(mockConnectComposerToStore1);
      });

      it('should assign events one for one until there are more listeners than events, at which point the last event will be assigned to remaining listeners on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(0);
        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each listener
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(4);

        // first addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

        // second addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // third addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[2]);
        expect(mockStore1.addChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // fourth addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[3][0]).toBe(mockConnectComposerToStoreReturn1.listener[3]);
        expect(mockStore1.addChangeListener.mock.calls[3][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);
      });

      it('removes the mapped change listeners to events, when there are more listeners than events, on componentWillUnmount', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(0);
        mockMixin.componentDidMount();
        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockEvent
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(4);

        // first removeChangeListener call
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

        // second removeChangeListener call
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // third removeChangeListener call
        expect(mockStore1.removeChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[2]);
        expect(mockStore1.removeChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

        // fourth removeChangeListener call
        expect(mockStore1.removeChangeListener.mock.calls[3][0]).toBe(mockConnectComposerToStoreReturn1.listener[3]);
        expect(mockStore1.removeChangeListener.mock.calls[3][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);
      });
    });

    describe('no event type provided', function () {
      beforeEach(function () {
        mockConnectComposerToStoreReturn1.listener = [mockListener2, mockListener4];
        mockMixin = TuxxStoreMixinGenerator(mockConnectComposerToStore1);
      });

      // The addChangeListener on the real store will assign a default change event, which is overwritten
      // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
      it('should assign undefined as the event type when no event type provided on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(0);

        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each mockListener
        expect(mockStore1.addChangeListener.mock.calls.length).toBe(2);

        // first call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toBeUndefined();

        // second call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toBeUndefined();
      });

      // The removeChangeListener on the real store will assign a default change event, which is overwritten
      // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
      it('removes the mapped listeners, on componentWillUnmount, when no event type is specified', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(0);

        mockMixin.componentDidMount();
        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockListener
        expect(mockStore1.removeChangeListener.mock.calls.length).toBe(2);

        // first call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBeUndefined();

        // second call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBeUndefined();
      });
    });
  });

  describe('array of mockConnectComposerToStore functions', function () {
    beforeEach(function () {
      mockConnectComposerToStoreReturn1.listener = [mockListener1, mockListener3, mockListener4];
      mockConnectComposerToStoreReturn1.event = [mockEvent2, mockEvent3];
      mockConnectComposerToStoreReturn2.listener = [mockListener2, mockListener3];
      mockConnectComposerToStoreReturn2.event = [mockEvent1, mockEvent3, mockEvent4];

      mockMixin = TuxxStoreMixinGenerator([mockConnectComposerToStore1, mockConnectComposerToStore2]);
    });

    it('add change listeners to each individual store when multiple stores provided', function () {
      // addChangeListener should not have been called on either store yet
      expect(mockStore1.addChangeListener.mock.calls.length).toBe(0);
      expect(mockStore2.addChangeListener.mock.calls.length).toBe(0);

      // add change listeners to mockStore1 and mockStore2
      mockMixin.componentDidMount();

      // mockStore1 addChangeListener count should increase and mockStore2 addChangeListener count should remain the same
      expect(mockStore1.addChangeListener.mock.calls.length).toBe(3);
      expect(mockStore2.addChangeListener.mock.calls.length).toBe(3);

      // first call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
      expect(mockStore1.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

      // second call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
      expect(mockStore1.addChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

      // third call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[2]);
      expect(mockStore1.addChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

      // first call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn2.listener[0]);
      expect(mockStore2.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn2.event[0]);

      // second call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.addChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn2.event[1]);

      // third call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.addChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn2.event[2]);
    });

    it('should remove change listeners on each individual store when multiple stores provided', function () {
      // removeChangeListener should not have been called on either store yet
      expect(mockStore1.removeChangeListener.mock.calls.length).toBe(0);
      expect(mockStore2.removeChangeListener.mock.calls.length).toBe(0);

      // remove change listeners from mockStore1 and mockStore2
      mockMixin.componentDidMount();
      mockMixin.componentWillUnmount();

      // mockStore1 removeChangeListener count should increase and mockStore2 removeChangeListener count should remain the same
      expect(mockStore1.removeChangeListener.mock.calls.length).toBe(3);
      expect(mockStore2.removeChangeListener.mock.calls.length).toBe(3);

      // first call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
      expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn1.event[0]);

      // second call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
      expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

      // third call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn1.listener[2]);
      expect(mockStore1.removeChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn1.event[1]);

      // first call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn2.listener[0]);
      expect(mockStore2.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn2.event[0]);

      // second call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.removeChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn2.event[1]);

      // third call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[2][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.removeChangeListener.mock.calls[2][1]).toBe(mockConnectComposerToStoreReturn2.event[2]);
    });
  });

  describe('no event type provided on one mockStore', function () {
    beforeEach(function () {
      mockConnectComposerToStoreReturn1.listener = [mockListener1, mockListener3];
      mockConnectComposerToStoreReturn2.listener = [mockListener2, mockListener3];
      mockConnectComposerToStoreReturn2.event = [mockEvent1, mockEvent4];
      mockMixin = TuxxStoreMixinGenerator([mockConnectComposerToStore1, mockConnectComposerToStore2]);
    });

    // The addChangeListener on the real store will assign a default change event, which is overwritten
    // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
    it('should assign undefined as the event type when no event type provided, while also mapping provided event types to listeners, on componentDidMount', function () {
      // addChangeListener should not have been called yet
      expect(mockStore1.addChangeListener.mock.calls.length).toBe(0);
      expect(mockStore2.addChangeListener.mock.calls.length).toBe(0);

      mockMixin.componentDidMount();

      // addChangeListener should have been called once for each mockListener on both mockStores
      expect(mockStore1.addChangeListener.mock.calls.length).toBe(2);
      expect(mockStore2.addChangeListener.mock.calls.length).toBe(2);

      // first call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
      expect(mockStore1.addChangeListener.mock.calls[0][1]).toBeUndefined();

      // second call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
      expect(mockStore1.addChangeListener.mock.calls[1][1]).toBeUndefined();

      // first call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn2.listener[0]);
      expect(mockStore2.addChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn2.event[0]);

      // second call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.addChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn2.event[1]);
    });

    // The removeChangeListener on the real store will assign a default change event, which is overwritten
    // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
    it('removes the mapped listeners, on componentWillUnmount, when no event type is specified, as well as when they are provided', function () {
      // removeChangeListener should not have been called yet on either mockStore
      expect(mockStore1.removeChangeListener.mock.calls.length).toBe(0);
      expect(mockStore2.removeChangeListener.mock.calls.length).toBe(0);

      mockMixin.componentDidMount();
      mockMixin.componentWillUnmount();

      // removeChangeListener should have been called once for each mockListener on each mockStore
      expect(mockStore1.removeChangeListener.mock.calls.length).toBe(2);
      expect(mockStore2.removeChangeListener.mock.calls.length).toBe(2);

      // first call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn1.listener[0]);
      expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBeUndefined();

      // second call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn1.listener[1]);
      expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBeUndefined();

      // first call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[0][0]).toBe(mockConnectComposerToStoreReturn2.listener[0]);
      expect(mockStore2.removeChangeListener.mock.calls[0][1]).toBe(mockConnectComposerToStoreReturn2.event[0]);

      // second call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[1][0]).toBe(mockConnectComposerToStoreReturn2.listener[1]);
      expect(mockStore2.removeChangeListener.mock.calls[1][1]).toBe(mockConnectComposerToStoreReturn2.event[1]);
    });
  });
});
