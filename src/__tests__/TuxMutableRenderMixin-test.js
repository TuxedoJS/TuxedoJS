'use strict';

var moduleToTest = '../TuxMutableRenderMixin';

jest.dontMock(moduleToTest);

describe('TuxMutableRenderMixin', function () {
  var tuxMutableRenderMixin, nextProps, nextState, tuxMutableTraits;

  beforeEach(function () {
    tuxMutableRenderMixin = require(moduleToTest);
    tuxMutableRenderMixin.constructor = {};
    tuxMutableRenderMixin.props = {
      message: {
        text: 'test text'
      },
      value: 2
    };
    tuxMutableRenderMixin.state = {
      editing: false
    };
    tuxMutableRenderMixin.mutableTraits = {
      props: ['text', 'value'],
      state: 'editing'
    };
  });

  it('should have componentWillMount and shouldComponentUpdate properties', function () {
    expect(tuxMutableRenderMixin.componentWillMount).toBeDefined();
    expect(tuxMutableRenderMixin.shouldComponentUpdate).toBeDefined();
  });

  describe('componentWillMount', function () {
    it('should add the __tuxMutableTraits__ prop to the constructor prop', function () {
      expect(tuxMutableRenderMixin.constructor.__tuxMutableTraits__).toBeUndefined();

      tuxMutableRenderMixin.componentWillMount();

      expect(tuxMutableRenderMixin.constructor.__tuxMutableTraits__).toBeDefined();
    });

    it('should add the paths to the mutableTraits specified by strings and arrays', function () {
      tuxMutableRenderMixin.componentWillMount();
      tuxMutableTraits = tuxMutableRenderMixin.constructor.__tuxMutableTraits__;

      expect(tuxMutableTraits.length).toEqual(3);
      expect(tuxMutableTraits[0]).toEqual(['props', 'message', 'text']);
      expect(tuxMutableTraits[1]).toEqual(['props', 'value']);
      expect(tuxMutableTraits[2]).toEqual(['state', 'editing']);
    });

    it('should not recreate mutable traits paths if the __tuxMutableTraits__ prop exists ', function () {
      // Establish initial __tuxMutableTraits__ value
      tuxMutableRenderMixin.componentWillMount();
      tuxMutableTraits = tuxMutableRenderMixin.constructor.__tuxMutableTraits__;

      // Create mockComponent and assign the value created during the first componentWillMount call
      var mockComponent = {};
      mockComponent.constructor = {};
      mockComponent.constructor.__tuxMutableTraits__ = tuxMutableTraits;

      // Call componentWillMount a second time using the mockComponent as the context.
      // Expect the value of __tuxMutableTraits__ to be equal to the value from the first invocation.
      tuxMutableRenderMixin.componentWillMount.call(mockComponent);
      expect(mockComponent.constructor.__tuxMutableTraits__).toBe(tuxMutableTraits);
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
      tuxMutableRenderMixin.constructor = {
        __tuxMutableTraits__: [['props', 'message', 'text'], ['props', 'value'], ['state', 'editing']]
      };
    });

    it('should throw and error when __tuxMutableTraits__ prop is not defined on the component', function () {
      tuxMutableRenderMixin.constructor.__tuxMutableTraits__ = undefined;
      expect(function() {
        tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState);
      }).toThrow(new Error('Invariant Violation: The __tuxMutableTraits__ property is not defined on the component.'));
    });

    it('should return false when there are no differences between current state and props and next props and state', function () {
      expect(tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeFalsy();
    });

    it('should return true when there is a difference between current props and next props', function () {
      nextProps.message.text = 'updated text';
      expect(tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeTruthy();
    });

    it('should return true when there is a difference between current state and next state', function () {
      nextState.editing = true;
      expect(tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeTruthy();
    });

    it('should return false if a trait that is not being tracked changes', function () {
      nextProps.updated = true;
      nextState.updated = true;
      expect(tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeFalsy();
    });
  });
});
