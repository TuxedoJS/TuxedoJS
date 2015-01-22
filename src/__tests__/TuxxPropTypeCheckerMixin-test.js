'use strict';

var moduleToTest = 'tuxx/src/TuxxPropTypeCheckerMixin';

jest.dontMock(moduleToTest);

describe('propTypeCheckerMixin', function () {
  var propTypeCheckerMixin, mockComponent;
  beforeEach(function () {
    propTypeCheckerMixin = require(moduleToTest);
    mockComponent = {
      //provide mock function to be invoked on componentWillMount
      _checkPropTypes: jest.genMockFn()
    };
  });

  it('should submit component.nearestOwnerPropTypes and nearestOwnerProps to _checkPropTypes on componentWillMount if nearestOwnerPropTypes is defined on the component', function () {
    //define nearestOwnerPropTypes on the component
    mockComponent.nearestOwnerPropTypes = {};
    //define nearestOwnerProps on the component
    mockComponent.nearestOwnerProps = {};
    //invoke componentWillMount passing in the mockComponent as the context
    propTypeCheckerMixin.componentWillMount.call(mockComponent);
    //check inputs to _checkPropTypes
    var checkPropTypesCall = mockComponent._checkPropTypes.mock.calls[0];
    expect(checkPropTypesCall[0]).toBe(mockComponent.nearestOwnerPropTypes);
    expect(checkPropTypesCall[1]).toBe(mockComponent.nearestOwnerProps);
    expect(checkPropTypesCall[2]).toBe('nearestOwnerProps');
  });

  it('should submit component.anyPropTypes and nearestOwnerProps extended with props to _checkPropTypes on componentWillMount if anyPropTypes is defined on the component', function () {
    //define anyPropTypes on the component
    mockComponent.anyPropTypes = {};
    //define nearestOwnerProps and props that can be merged together
    mockComponent.nearestOwnerProps = {
      prop1: {},
      prop2: {}
    };
    mockComponent.props = {
      //define prop2 on props as well to test that props is overwriting nearestOwnerProps
      prop2: {}
    };
    //invoke componentWillMount passing in the mockComponent as the context
    propTypeCheckerMixin.componentWillMount.call(mockComponent);
    //check inputs to _checkPropTypes
    var checkPropTypesCall = mockComponent._checkPropTypes.mock.calls[0];
    expect(checkPropTypesCall[0]).toBe(mockComponent.anyPropTypes);
    expect(checkPropTypesCall[1].prop1).toBe(mockComponent.nearestOwnerProps.prop1);
    //props should overwrite nearestOwnerProps
    expect(checkPropTypesCall[1].prop2).toBe(mockComponent.props.prop2);
    expect(checkPropTypesCall[2]).toBe('props or nearestOwnerProps');
  });
});
