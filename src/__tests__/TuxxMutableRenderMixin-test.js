'use strict';

var moduleToTest = 'tuxx/src/TuxxMutableRenderMixin';

jest.dontMock(moduleToTest);

describe('TuxxMutableRenderMixin', function () {
  var tuxxMutableRenderMixin, nextProps, nextState, tuxxMutableTraits;

  beforeEach(function () {
    tuxxMutableRenderMixin = require(moduleToTest);
    tuxxMutableRenderMixin.constructor = {};
    tuxxMutableRenderMixin.props = {
      message: {
        text: 'test text'
      },
      value: 2
    };
    tuxxMutableRenderMixin.state = {
      editing: false
    };
    tuxxMutableRenderMixin.mutableTraits = {
      props: ['text', 'value'],
      state: 'editing'
    };
  });

  it('should have componentWillMount and shouldComponentUpdate properties', function () {
    expect(tuxxMutableRenderMixin.componentWillMount).toBeDefined();
    expect(tuxxMutableRenderMixin.shouldComponentUpdate).toBeDefined();
  });

  describe('componentWillMount', function () {
    it('should add the __tuxxMutableTraits__ prop to the constructor prop', function () {
      expect(tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__).toBeUndefined();

      tuxxMutableRenderMixin.componentWillMount();

      expect(tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__).toBeDefined();
    });

    it('should add the paths to the mutableTraits specified by strings and arrays', function () {
      tuxxMutableRenderMixin.componentWillMount();
      tuxxMutableTraits = tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__;

      expect(tuxxMutableTraits.length).toEqual(3);
      expect(tuxxMutableTraits[0]).toEqual(['props', 'message', 'text']);
      expect(tuxxMutableTraits[1]).toEqual(['props', 'value']);
      expect(tuxxMutableTraits[2]).toEqual(['state', 'editing']);
    });

    it('should add the paths to the mutableTraits if an array of arrays is specified', function () {
      tuxxMutableRenderMixin.mutableTraits.props[0] = ['message', 'text'];
      tuxxMutableRenderMixin.componentWillMount();
      tuxxMutableTraits = tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__;

      expect(tuxxMutableTraits.length).toEqual(3);
      expect(tuxxMutableTraits[0]).toEqual(['props', 'message', 'text']);
      expect(tuxxMutableTraits[1]).toEqual(['props', 'value']);
      expect(tuxxMutableTraits[2]).toEqual(['state', 'editing']);
    });

    it('should not recreate mutable traits paths if the __tuxxMutableTraits__ prop exists ', function () {
      // Establish initial __tuxxMutableTraits__ value
      tuxxMutableRenderMixin.componentWillMount();
      tuxxMutableTraits = tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__;

      // Create mockComponent and assign the value created during the first componentWillMount call
      var mockComponent = {};
      mockComponent.constructor = {};
      mockComponent.constructor.__tuxxMutableTraits__ = tuxxMutableTraits;

      // Call componentWillMount a second time using the mockComponent as the context.
      // Expect the value of __tuxxMutableTraits__ to be equal to the value from the first invocation.
      tuxxMutableRenderMixin.componentWillMount.call(mockComponent);
      expect(mockComponent.constructor.__tuxxMutableTraits__).toBe(tuxxMutableTraits);
    });
  });

  describe('shouldComponentUpdate', function () {
    beforeEach(function () {
      nextProps = {
        message: {
          text: 'test text'
        },
        value: 2,
        updated: false
      };
      nextState = {
        editing: false,
        updated: false
      };
      tuxxMutableRenderMixin.constructor = {
        __tuxxMutableTraits__: [['props', 'message', 'text'], ['props', 'value'], ['state', 'editing']]
      };
    });

    it('should throw and error when __tuxxMutableTraits__ prop is not defined on the component', function () {
      tuxxMutableRenderMixin.constructor.__tuxxMutableTraits__ = undefined;
      expect(function() {
        tuxxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState);
      }).toThrow(new Error('Invariant Violation: The __tuxxMutableTraits__ property is not defined on the component.'));
    });

    it('should return false when there are no differences between current state and props and next props and state', function () {
      expect(tuxxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeFalsy();
    });

    it('should return true when there is a difference between current props and next props', function () {
      nextProps.message.text = 'updated text';
      expect(tuxxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeTruthy();
    });

    it('should return true when there is a difference between current state and next state', function () {
      nextState.editing = true;
      expect(tuxxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeTruthy();
    });

    it('should return false if a trait that is not being tracked changes', function () {
      nextProps.updated = true;
      nextState.updated = true;
      expect(tuxxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeFalsy();
    });
  });
});
