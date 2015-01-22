'use strict';

var moduleToTest = 'tuxx/src/TuxxArchitectStores';

jest.dontMock(moduleToTest);

describe('architect', function () {
  var architect, root1Store, branch1Store, branch2Store, leaf11Store, leaf12Store, leaf21Store;

  beforeEach(function () {
    //reset architect
    architect = require(moduleToTest);
    //chain of tuxx stores
    /*
                [root1]
               /       \
        [branch1]   [branch2]
         /    \          \
   [leaf11] [leaf12]   [leaf21]
    */
    //reset stores, need to set __registerId__ for architecting
    root1Store = {__registerId__: {}};
    branch1Store = {__registerId__: {}};
    branch2Store = {__registerId__: {}};
    leaf11Store = {__registerId__: {}};
    leaf12Store = {__registerId__: {}};
    leaf21Store = {__registerId__: {}};
    //generate root1Output
    architect(root1Store).itOutputs('root1Output');
  });

  it('should add an array of __registerId__s to any store that needs what another store outputs at the key of __tuxxArchitecture__', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds('root1Output').itOutputs('branch1Output');
    architect(branch2Store).itNeeds('root1Output').itOutputs('branch2Output');
    architect(leaf11Store).itNeeds('branch1Output');
    architect(leaf12Store).itNeeds('branch1Output');
    architect(leaf21Store).itNeeds('branch2Output');

    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch1Store.__tuxxArchitecture__.length).toBe(1);
    expect(branch2Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch2Store.__tuxxArchitecture__.length).toBe(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__.length).toBe(1);
    expect(leaf12Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf12Store.__tuxxArchitecture__.length).toBe(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxxArchitecture__[0]).toBe(branch2Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__.length).toBe(1);
  });

  it('should add the __tuxxArchitecture__ prop to any store that needs another store directly', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds(root1Store);
    architect(branch2Store).itNeeds(root1Store);
    architect(leaf11Store).itNeeds(branch1Store);
    architect(leaf12Store).itNeeds(branch1Store);
    architect(leaf21Store).itNeeds(branch2Store);

    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch1Store.__tuxxArchitecture__.length).toBe(1);
    expect(branch2Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch2Store.__tuxxArchitecture__.length).toBe(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__.length).toBe(1);
    expect(leaf12Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf12Store.__tuxxArchitecture__.length).toBe(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxxArchitecture__[0]).toBe(branch2Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__.length).toBe(1);
  });

  it('should add the __tuxxArchitecture__ props when a mix of stores and outputs is used', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds(root1Store).itOutputs('branch1Output');
    architect(branch2Store).itNeeds(root1Store).itOutputs('branch2Output');
    architect(leaf11Store).itNeeds(branch1Store);
    architect(leaf12Store).itNeeds('branch1Output');
    architect(leaf21Store).itNeeds('branch2Output');

    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch1Store.__tuxxArchitecture__.length).toBe(1);
    expect(branch2Store.__tuxxArchitecture__[0]).toBe(root1Store.__registerId__);
    expect(branch2Store.__tuxxArchitecture__.length).toBe(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__.length).toBe(1);
    expect(leaf12Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf12Store.__tuxxArchitecture__.length).toBe(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxxArchitecture__[0]).toBe(branch2Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__.length).toBe(1);
  });

  it('should allow a store to have multiple outputs', function () {
    //create dependency chain wherein all leaves and branch2 need branch1
    architect(branch1Store).itOutputs(['branch1Output', 'branch1Output2'], 'branch1Output3').and('branch1Output4');
    architect(leaf11Store).itNeeds('branch1Output');
    architect(leaf12Store).itNeeds('branch1Output2');
    architect(leaf21Store).itNeeds('branch1Output3');
    architect(branch2Store).itNeeds('branch1Output4');

    //leaf11, leaf12, leaf21, and branch2 should be architected to wait for only branch1
    expect(leaf11Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__.length).toBe(1);
    expect(leaf12Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf12Store.__tuxxArchitecture__.length).toBe(1);
    expect(leaf21Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__.length).toBe(1);
    expect(branch2Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(branch2Store.__tuxxArchitecture__.length).toBe(1);
  });

  it('should allow a store to need multiple stores and outputs', function () {
    //create dependency chain wherein leaf21 needs both branches, leaf11, and the root
    architect(branch1Store).itOutputs('branch1Output');
    architect(leaf21Store).itNeeds(['branch1Output', branch2Store], leaf11Store).and('root1Output');

    //leaf21 should be architected to wait for root1, branch1, branch2, and leaf11
    expect(leaf21Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__[1]).toBe(branch2Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__[2]).toBe(leaf11Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__[3]).toBe(root1Store.__registerId__);
    expect(leaf21Store.__tuxxArchitecture__.length).toBe(4);
  });

  it('should throw an error if a store is waiting for an input that no store outputs', function () {
    expect(function () {
      architect(root1Store).itNeeds('test');
    }).toThrow(new Error('Invariant Violation: store is waiting for an input: "test" that no store outputs.  If this store needs no inputs than only call "itOutputs" method.'));
  });

  it('should throw an error if a store is waiting for a store that does not have a __registerId__', function () {
    delete root1Store.__registerId__;
    expect(function () {
      architect(branch1Store).itNeeds('root1Output');
    }).toThrow(new Error('Invariant Violation: store is waiting for a store that has not been registered to any actions.'));
  });

  it('should add multiple stores if multiple stores output what the store needs', function () {
    //create dependency chain
    architect(branch1Store).itOutputs('root2Output');
    architect(branch2Store).itOutputs('root2Output');
    architect(leaf21Store).itOutputs('root2Output');
    architect(leaf11Store).itNeeds('root2Output');

    //leaf11 store should be architected to wait for branch1, branch2, and leaf21
    expect(leaf11Store.__tuxxArchitecture__[0]).toBe(branch1Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__[1]).toBe(branch2Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__[2]).toBe(leaf21Store.__registerId__);
    expect(leaf11Store.__tuxxArchitecture__.length).toBe(3);
  });
});
