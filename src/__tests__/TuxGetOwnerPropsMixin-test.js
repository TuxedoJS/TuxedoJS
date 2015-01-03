'use strict';

var moduleToTest = '../TuxGetOwnerPropsMixin.js';

jest.dontMock(moduleToTest);

describe('getOwnerPropsMixin', function () {
  var getOwnerPropsMixin, root1Owner, branch1Owner, branch2Ownee, leaf11Ownee, leaf12Owner, leaf21Ownee;

  beforeEach(function () {
    //reset getOwnerPropsMixin
    getOwnerPropsMixin = require(moduleToTest);
    //construct chain of _owner objects tO = tuxOwner
    /*
                [root1 tO]
              /            \
       [branch1 tO]     [branch2]
        /       \             \
    [leaf11] [leaf12 tO]    [leaf12]
    */
    root1Owner = {
      __tuxIsOwnerComponent__: true,
      ownerProps: {}
    };
    branch1Owner = {
      _owner: root1Owner,
      __tuxIsOwnerComponent__: true,
      ownerProps: {}
    };
    branch2Ownee = {
      _owner: root1Owner
    };
    leaf11Ownee = {
      _owner: branch1Owner
    };
    leaf12Owner = {
      _owner: branch1Owner,
      __tuxIsOwnerComponent__: true,
      ownerProps: {}
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
    expect(branch1Owner.nearestOwnerProps).toEqual(root1Owner.ownerProps);
    expect(branch2Ownee.nearestOwnerProps).toEqual(root1Owner.ownerProps);
    //leaves under branch1 owner should inherit from branch1 owner
    expect(leaf11Ownee.nearestOwnerProps).toEqual(branch1Owner.ownerProps);
    expect(leaf12Owner.nearestOwnerProps).toEqual(branch1Owner.ownerProps);
    //leaf under branch2 ownee should inherit from root owner
    expect(leaf21Ownee.nearestOwnerProps).toEqual(root1Owner.ownerProps);
  });
});
