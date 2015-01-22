'use strict';

var moduleToTest = 'tuxx/src/TuxxGetOwnerPropsMixin';

jest.dontMock(moduleToTest);

describe('getOwnerPropsMixin', function () {
  var getOwnerPropsMixin, root1Owner, branch1Owner, branch2Ownee, leaf11Ownee, leaf12Owner, leaf21Ownee;

  beforeEach(function () {
    //reset getOwnerPropsMixin
    getOwnerPropsMixin = require(moduleToTest);
    //construct chain of _owner objects tO = tuxxOwner
    /*
                [root1 tO]
              /            \
       [branch1 tO]     [branch2]
        /       \             \
    [leaf11] [leaf12 tO]    [leaf21]
    */
    //reset Owners and Ownees
    root1Owner = {
      __tuxxIsOwnerComponent__: true,
      mockOwnerProps: {},
      registerOwnerProps: function () {
        return this.mockOwnerProps;
      }
    };
    branch1Owner = {
      _owner: root1Owner,
      __tuxxIsOwnerComponent__: true,
      mockOwnerProps: {},
      registerOwnerProps: function () {
        return this.mockOwnerProps;
      }
    };
    branch2Ownee = {
      _owner: root1Owner
    };
    leaf11Ownee = {
      _owner: branch1Owner
    };
    leaf12Owner = {
      _owner: branch1Owner,
      __tuxxIsOwnerComponent__: true,
      mockOwnerProps: {},
      registerOwnerProps: function () {
        return this.mockOwnerProps;
      }
    };
    leaf21Ownee = {
      _owner: branch2Ownee
    };
  });

  it('should properly pass down the ownerProps to nearestOwnerProps from owner to owner and owner to ownee on componentWillMount', function () {
    //cascade down componentWillMount calls as functions would be invoked in React
    getOwnerPropsMixin.componentWillMount.call(root1Owner);
    getOwnerPropsMixin.componentWillMount.call(branch1Owner);
    getOwnerPropsMixin.componentWillMount.call(branch2Ownee);
    getOwnerPropsMixin.componentWillMount.call(leaf11Ownee);
    getOwnerPropsMixin.componentWillMount.call(leaf12Owner);
    getOwnerPropsMixin.componentWillMount.call(leaf21Ownee);
    //check for props
    //branches should each inherit from the root owner
    expect(branch1Owner.nearestOwnerProps).toBe(root1Owner.__tuxxOwnerProps__);
    expect(branch2Ownee.nearestOwnerProps).toBe(root1Owner.__tuxxOwnerProps__);
    //leaves under branch1 owner should inherit from branch1 owner
    expect(leaf11Ownee.nearestOwnerProps).toBe(branch1Owner.__tuxxOwnerProps__);
    expect(leaf12Owner.nearestOwnerProps).toBe(branch1Owner.__tuxxOwnerProps__);
    //leaf under branch2 ownee should inherit from root owner
    expect(leaf21Ownee.nearestOwnerProps).toBe(root1Owner.__tuxxOwnerProps__);
  });

  it('should be able to get the nearestOwnerProps even if an intermediary component does not have a nearestOwnerProps or __tuxxOwnerProps__ key', function () {
    //mount the root1Owner and leaf21Ownee
    getOwnerPropsMixin.componentWillMount.call(root1Owner);
    getOwnerPropsMixin.componentWillMount.call(leaf21Ownee);
    //expect the leaft21Ownee to have the root1Owner __tuxxOwnerProps__ even though branch2Ownee has not been mounted
    expect(leaf21Ownee.nearestOwnerProps).toBe(root1Owner.__tuxxOwnerProps__);
  });
});
