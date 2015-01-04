'use strict';

var moduleToTest = '../TuxArchitectStores.js';

jest.dontMock(moduleToTest);

describe('architect', function () {
  var architect, root1Store, branch1Store, branch2Store, leaf11Store, leaf12Store, leaf21Store;

  beforeEach(function () {
    //reset architect
    architect = require(moduleToTest);
    //chain of tux stores
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

  it('should add the __registerId__ to any store that needs what another store outputs at an array on the key of __tuxArchitecture__', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds('root1Output').itOutputs('branch1Output');
    architect(branch2Store).itNeeds('root1Output').itOutputs('branch2Output');
    architect(leaf11Store).itNeeds('branch1Output');
    architect(leaf12Store).itNeeds('branch1Output');
    architect(leaf21Store).itNeeds('branch2Output');
    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch1Store.__tuxArchitecture__.length).toEqual(1);
    expect(branch2Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch2Store.__tuxArchitecture__.length).toEqual(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf11Store.__tuxArchitecture__.length).toEqual(1);
    expect(leaf12Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf12Store.__tuxArchitecture__.length).toEqual(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxArchitecture__[0]).toEqual(branch2Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__.length).toEqual(1);
  });

  it('should add the __tuxArchitecture__ prop to any store that needs another store directly', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds(root1Store);
    architect(branch2Store).itNeeds(root1Store);
    architect(leaf11Store).itNeeds(branch1Store);
    architect(leaf12Store).itNeeds(branch1Store);
    architect(leaf21Store).itNeeds(branch2Store);
    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch1Store.__tuxArchitecture__.length).toEqual(1);
    expect(branch2Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch2Store.__tuxArchitecture__.length).toEqual(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf11Store.__tuxArchitecture__.length).toEqual(1);
    expect(leaf12Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf12Store.__tuxArchitecture__.length).toEqual(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxArchitecture__[0]).toEqual(branch2Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__.length).toEqual(1);
  });

  it('should add the __tuxArchitecture__ props when a mix of stores and outputs is used', function () {
    //create dependency chain described above
    architect(branch1Store).itNeeds(root1Store).itOutputs('branch1Output');
    architect(branch2Store).itNeeds(root1Store).itOutputs('branch2Output');
    architect(leaf11Store).itNeeds(branch1Store);
    architect(leaf12Store).itNeeds('branch1Output');
    architect(leaf21Store).itNeeds('branch2Output');
    //branch1 and branch2 should be architected to wait for only root1Store
    expect(branch1Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch1Store.__tuxArchitecture__.length).toEqual(1);
    expect(branch2Store.__tuxArchitecture__[0]).toEqual(root1Store.__registerId__);
    expect(branch2Store.__tuxArchitecture__.length).toEqual(1);
    //leaf11 and leaf12 should be architected to wait for only branch1
    expect(leaf11Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf11Store.__tuxArchitecture__.length).toEqual(1);
    expect(leaf12Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf12Store.__tuxArchitecture__.length).toEqual(1);
    //leaf21 should be architected to wait for only branch2
    expect(leaf21Store.__tuxArchitecture__[0]).toEqual(branch2Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__.length).toEqual(1);
  });

  it('should allow a store to output multiple outputs', function () {
    //create dependency chain wherein all leaves need branch1
    architect(branch1Store).itNeeds('root1Output').itOutputs(['branch1Output', 'branch1Output2']).and('branch1Output3');
    architect(leaf11Store).itNeeds('branch1Output');
    architect(leaf12Store).itNeeds('branch1Output2');
    architect(leaf21Store).itNeeds('branch1Output3');
    //leaf11, leaf12, and leaf21 should be architected to wait for only branch1
    expect(leaf11Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf11Store.__tuxArchitecture__.length).toEqual(1);
    expect(leaf12Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf12Store.__tuxArchitecture__.length).toEqual(1);
    expect(leaf21Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__.length).toEqual(1);
  });

  it('should allow a store to need multiple stores and outputs', function () {
    //create dependency chain wherein leaf21 needs both branches and the root
    architect(branch1Store).itOutputs('branch1Output');
    architect(leaf21Store).itNeeds(['branch1Output', branch2Store]).and('root1Output');
    expect(leaf21Store.__tuxArchitecture__[0]).toEqual(branch1Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__[1]).toEqual(branch2Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__[2]).toEqual(root1Store.__registerId__);
    expect(leaf21Store.__tuxArchitecture__.length).toEqual(3);
  });

  it('should throw an error if a store is waiting for an input that no store outputs', function () {
    expect(function () {
      architect(root1Store).itNeeds('test');
    }).toThrow(new Error('store is waiting for an input: "test" that no store outputs.  If this store needs no inputs than only call "itOutputs"'));
  });

  it('should throw an error if a store is waiting for a store that does not have a __registerId__', function () {
    delete root1Store.__registerId__;
    expect(function () {
      architect(branch1Store).itNeeds('root1Output');
    }).toThrow(new Error('store is waiting for a store that has not been registered to the dispatcher'));
  });

  it('a store attempts to output the same string another store is already outputing', function () {
    expect(function () {
      architect(branch1Store).itOutputs('root1Output');
    }).toThrow(new Error('output: "root1Output" is already registered to a store'));
  });
});
