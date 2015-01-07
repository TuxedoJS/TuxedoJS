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
      tuxMutableRenderMixin.constructor = mockComponent.constructor;

      // Call componentWillMount a second time, expecting the value of __tuxMutableTraits__ to be equal to the value from the first invocation
      tuxMutableRenderMixin.componentWillMount();
      expect(tuxMutableRenderMixin.constructor.__tuxMutableTraits__).toEqual(tuxMutableTraits);
    });
  });

  describe('shouldComponentUpdate', function () {
    beforeEach(function () {
      nextProps = {
        message: {
          text: 'test text'
        },
        value: 2
      };
      nextState = {
        editing: false
      };
      tuxMutableRenderMixin.constructor = {
        __tuxMutableTraits__: [['props', 'message', 'text'], ['props', 'value'], ['state', 'editing']]
      };
    });

    it('should return false when __tuxMutableTraits__ is not defined', function () {
      tuxMutableRenderMixin.constructor.__tuxMutableTraits__ = undefined;
      expect(tuxMutableRenderMixin.shouldComponentUpdate(nextProps, nextState)).toBeFalsy();
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
  });
});
