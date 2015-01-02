'use strict';
var moduleToTest = '../TuxStoreMixinGenerator';

jest.dontMock(moduleToTest);

describe('TuxStoreMixinGenerator', function () {
  var TuxStoreMixinGenerator, mockStore, mockStore2, mockListener1, mockListener2, mockListener3, mockListener4, mockEvent1, mockEvent2, mockEvent3, mockEvent4, mockConnectComposerToStore, mockConnectComposerToStore2, mockMixin;

  beforeEach(function () {
    TuxStoreMixinGenerator = require(moduleToTest);
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
    mockConnectComposerToStore = { store: mockStore1 };
    mockConnectComposerToStore2 = { store: mockStore2 };
  });

  it('should return an empty object when no inut argument supplied', function () {
    expect(TuxStoreMixinGenerator()).toEqual({});
  });

  describe('mockConnectComposerToStore object', function () {
    describe('single event and listener on mockConnectComposerToStore input object', function () {
      beforeEach(function () {
        mockConnectComposerToStore.listener = mockListener1;
        mockConnectComposerToStore.event = mockEvent1;
        mockMixin = TuxStoreMixinGenerator(mockConnectComposerToStore);
      });

      it('should return an object with componentDidMount and componentWillUnmount keys', function () {
        expect(mockMixin.componentDidMount).toBeDefined();
        expect(mockMixin.componentWillUnmount).toBeDefined();
      });

      it('adds a change listener for provided event on componentDidMount', function () {
        mockMixin.componentDidMount();
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toEqual(mockEvent1);
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(1);
      });

      it('removes a change listener for provided event on componentWillUnmount', function () {
        mockMixin.componentWillUnmount();
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent1);
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(1);
      });
    });

    describe('more events than listeners', function () {
      beforeEach(function () {
        mockConnectComposerToStore.listener = [mockListener1, mockListener2];
        mockConnectComposerToStore.event = [mockEvent1, mockEvent2, mockEvent3, mockEvent4];
        mockMixin = TuxStoreMixinGenerator(mockConnectComposerToStore);
      });

      it('adds listeners and events one for one, until events are greater than listener length, at which point the last listener gets assigned to remaining events on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(0);
        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each mockEvent
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(4);
        // first call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

        // second call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toEqual(mockListener2);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toEqual(mockEvent2);

        // third call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[2][0]).toEqual(mockListener2);
        expect(mockStore1.addChangeListener.mock.calls[2][1]).toEqual(mockEvent3);

        // fourth call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[3][0]).toEqual(mockListener2);
        expect(mockStore1.addChangeListener.mock.calls[3][1]).toEqual(mockEvent4);
      });

      it('removes the mapped change listeners to events, when there are more events than listeners, on componentWillUnmount', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(0);
        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockEvent
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(4);

        // first call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

        // second call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toEqual(mockListener2);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toEqual(mockEvent2);

        // third call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[2][0]).toEqual(mockListener2);
        expect(mockStore1.removeChangeListener.mock.calls[2][1]).toEqual(mockEvent3);

        // fourth call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[3][0]).toEqual(mockListener2);
        expect(mockStore1.removeChangeListener.mock.calls[3][1]).toEqual(mockEvent4);
      });
    });

    describe('more listeners than events', function () {
      beforeEach(function () {
        mockConnectComposerToStore.listener = [mockListener1, mockListener2, mockListener3, mockListener4];
        mockConnectComposerToStore.event = [mockEvent1, mockEvent2];
        mockMixin = TuxStoreMixinGenerator(mockConnectComposerToStore);
      });

      it('should assign events one for one until there are more listeners than events, at which point the last event will be assigned to remaining listeners on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(0);
        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each listener
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(4);

        // first addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

        // second addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toEqual(mockListener2);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toEqual(mockEvent2);

        // third addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[2][0]).toEqual(mockListener3);
        expect(mockStore1.addChangeListener.mock.calls[2][1]).toEqual(mockEvent2);

        // fourth addChangeListener call
        expect(mockStore1.addChangeListener.mock.calls[3][0]).toEqual(mockListener4);
        expect(mockStore1.addChangeListener.mock.calls[3][1]).toEqual(mockEvent2);
      });

      it('removes the mapped change listeners to events, when there are more listeners than events, on componentWillUnmount', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(0);
        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockEvent
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(4);

        // first call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener1);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

        // second call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toEqual(mockListener2);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toEqual(mockEvent2);

        // third call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[2][0]).toEqual(mockListener3);
        expect(mockStore1.removeChangeListener.mock.calls[2][1]).toEqual(mockEvent2);

        // fourth call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[3][0]).toEqual(mockListener4);
        expect(mockStore1.removeChangeListener.mock.calls[3][1]).toEqual(mockEvent2);
      });
    });

    describe('no event type provided', function () {
      beforeEach(function () {
        mockConnectComposerToStore.listener = [mockListener2, mockListener4];
        mockMixin = TuxStoreMixinGenerator(mockConnectComposerToStore);
      });

      // The addChangeListener on the real store will assign a default change event, which is overwritten
      // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
      it('should assign undefined as the event type when no event type provided on componentDidMount', function () {
        // addChangeListener should not have been called yet
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(0);

        mockMixin.componentDidMount();

        // addChangeListener should have been called once for each mockListener
        expect(mockStore1.addChangeListener.mock.calls.length).toEqual(2);

        // first call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener2);
        expect(mockStore1.addChangeListener.mock.calls[0][1]).toBeUndefined();

        // second call of addChangeListener
        expect(mockStore1.addChangeListener.mock.calls[1][0]).toEqual(mockListener4);
        expect(mockStore1.addChangeListener.mock.calls[1][1]).toBeUndefined();
      });

      // The removeChangeListener on the real store will assign a default change event, which is overwritten
      // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
      it('removes the mapped listeners, on componentWillUnmount, when no event type is specified', function () {
        // removeChangeListener should not have been called yet
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(0);

        mockMixin.componentWillUnmount();

        // removeChangeListener should have been called once for each mockListener
        expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(2);

        // first call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener2);
        expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBeUndefined();

        // second call of removeChangeListener
        expect(mockStore1.removeChangeListener.mock.calls[1][0]).toEqual(mockListener4);
        expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBeUndefined();
      });
    });
  });

  describe('array of mockConnectComposerToStore objects', function () {
    beforeEach(function () {
      mockConnectComposerToStore.listener = [mockListener1, mockListener3, mockListener4];
      mockConnectComposerToStore.event = [mockEvent2, mockEvent3];
      mockConnectComposerToStore2.listener = [mockListener2, mockListener3];
      mockConnectComposerToStore2.event = [mockEvent1, mockEvent3, mockEvent4];

      mockMixin = TuxStoreMixinGenerator([mockConnectComposerToStore, mockConnectComposerToStore2]);
    });

    it('add change listeners to each individual store when multiple stores provided', function () {
      // addChangeListener should not have been called on either store yet
      expect(mockStore1.addChangeListener.mock.calls.length).toEqual(0);
      expect(mockStore2.addChangeListener.mock.calls.length).toEqual(0);

      // add change listeners to mockStore1 and mockStore2
      mockMixin.componentDidMount();

      // mockStore1 addChangeListener count should increase and mockStore2 addChangeListener count should remain the same
      expect(mockStore1.addChangeListener.mock.calls.length).toEqual(3);
      expect(mockStore2.addChangeListener.mock.calls.length).toEqual(3);

      // first call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener1);
      expect(mockStore1.addChangeListener.mock.calls[0][1]).toEqual(mockEvent2);

      // second call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore1.addChangeListener.mock.calls[1][1]).toEqual(mockEvent3);

      // third call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[2][0]).toEqual(mockListener4);
      expect(mockStore1.addChangeListener.mock.calls[2][1]).toEqual(mockEvent3);

      // first call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[0][0]).toEqual(mockListener2);
      expect(mockStore2.addChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

      // second call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore2.addChangeListener.mock.calls[1][1]).toEqual(mockEvent3);

      // third call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[2][0]).toEqual(mockListener3);
      expect(mockStore2.addChangeListener.mock.calls[2][1]).toEqual(mockEvent4);
    });

    it('should remove change listeners on each individual store when multiple stores provided', function () {
      // removeChangeListener should not have been called on either store yet
      expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(0);
      expect(mockStore2.removeChangeListener.mock.calls.length).toEqual(0);

      // add change listeners to mockStore1 and mockStore2
      mockMixin.componentWillUnmount();

      // mockStore1 removeChangeListener count should increase and mockStore2 removeChangeListener count should remain the same
      expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(3);
      expect(mockStore2.removeChangeListener.mock.calls.length).toEqual(3);

      // first call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener1);
      expect(mockStore1.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent2);

      // second call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore1.removeChangeListener.mock.calls[1][1]).toEqual(mockEvent3);

      // third call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[2][0]).toEqual(mockListener4);
      expect(mockStore1.removeChangeListener.mock.calls[2][1]).toEqual(mockEvent3);

      // first call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[0][0]).toEqual(mockListener2);
      expect(mockStore2.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

      // second call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore2.removeChangeListener.mock.calls[1][1]).toEqual(mockEvent3);

      // third call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[2][0]).toEqual(mockListener3);
      expect(mockStore2.removeChangeListener.mock.calls[2][1]).toEqual(mockEvent4);
    });
  });

  describe('no event type provided on one mockStore', function () {
    beforeEach(function () {
      mockConnectComposerToStore.listener = [mockListener1, mockListener3];
      mockConnectComposerToStore2.listener = [mockListener2, mockListener3];
      mockConnectComposerToStore2.event = [mockEvent1, mockEvent4];
      mockMixin = TuxStoreMixinGenerator([mockConnectComposerToStore, mockConnectComposerToStore2]);
    });

    // The addChangeListener on the real store will assign a default change event, which is overwritten
    // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
    it('should assign undefined as the event type when no event type provided, while also mapping provided event types to listners, on componentDidMount', function () {
      // addChangeListener should not have been called yet
      expect(mockStore1.addChangeListener.mock.calls.length).toEqual(0);
      expect(mockStore2.addChangeListener.mock.calls.length).toEqual(0);

      mockMixin.componentDidMount();

      // addChangeListener should have been called once for each mockListener on both mockStores
      expect(mockStore1.addChangeListener.mock.calls.length).toEqual(2);
      expect(mockStore2.addChangeListener.mock.calls.length).toEqual(2)

      // first call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[0][0]).toEqual(mockListener1);
      expect(mockStore1.addChangeListener.mock.calls[0][1]).toBeUndefined();

      // second call of addChangeListener on mockStore1
      expect(mockStore1.addChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore1.addChangeListener.mock.calls[1][1]).toBeUndefined();

      // first call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[0][0]).toEqual(mockListener2);
      expect(mockStore2.addChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

      // second call of addChangeListener on mockStore2
      expect(mockStore2.addChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore2.addChangeListener.mock.calls[1][1]).toEqual(mockEvent4);
    });

    // The removeChangeListener on the real store will assign a default change event, which is overwritten
    // by the second input argument, so the test ensures that that input argument is undefined and thus will go to the default
    it('removes the mapped listeners, on componentWillUnmount, when no event type is specified, as well as when they are provided', function () {
      // removeChangeListener should not have been called yet on either mockStore
      expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(0);
      expect(mockStore2.removeChangeListener.mock.calls.length).toEqual(0)

      mockMixin.componentWillUnmount();

      // removeChangeListener should have been called once for each mockListener on each mockStore
      expect(mockStore1.removeChangeListener.mock.calls.length).toEqual(2);
      expect(mockStore2.removeChangeListener.mock.calls.length).toEqual(2);

      // first call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[0][0]).toEqual(mockListener1);
      expect(mockStore1.removeChangeListener.mock.calls[0][1]).toBeUndefined();

      // second call of removeChangeListener on mockStore1
      expect(mockStore1.removeChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore1.removeChangeListener.mock.calls[1][1]).toBeUndefined();

      // first call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[0][0]).toEqual(mockListener2);
      expect(mockStore2.removeChangeListener.mock.calls[0][1]).toEqual(mockEvent1);

      // second call of removeChangeListener on mockStore2
      expect(mockStore2.removeChangeListener.mock.calls[1][0]).toEqual(mockListener3);
      expect(mockStore2.removeChangeListener.mock.calls[1][1]).toEqual(mockEvent4);
    });
  });
});
