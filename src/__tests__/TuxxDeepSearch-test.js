'use strict';

describe('deepSearch', function () {
  var deepSearch, mockObjectToSearch, traitsToFind;

  beforeEach(function () {
    //reset mocks and require stateements
    deepSearch = require('tuxx/src/TuxxDeepSearch');

    //define complex object to search with matching property names to make sure we find the correct one
    mockObjectToSearch = {
      id: 1,
      subProp: {
        id: 2,
        subSubProp: {
          id: 3,
          diffId: 1
        }
      },
      finalProp: {
        id: 1
      }
    };
  });

  it('should be able to deeply search an object', function () {
    expect(deepSearch('diffId', mockObjectToSearch)).toEqual(['subProp', 'subSubProp', 'diffId']);
  });

  it('should find the shallowest key first', function () {
    expect(deepSearch('id', mockObjectToSearch)).toEqual(['id']);
  });

  it('should accept an array to restrict the search', function () {
    expect(deepSearch(['subProp', 'id'], mockObjectToSearch)).toEqual(['subProp', 'id']);
    expect(deepSearch(['subSubProp', 'id'], mockObjectToSearch)).toEqual(['subProp', 'subSubProp', 'id']);
    expect(deepSearch(['finalProp', 'id'], mockObjectToSearch)).toEqual(['finalProp', 'id']);
  });

  it('should throw an error if a key cannot be found', function () {
    expect(function () {
      deepSearch('unmatchedId', mockObjectToSearch);
    }).toThrow(new Error('Invariant Violation: Could not find "unmatchedId" within object'));

    expect(function () {
      deepSearch(['subProp', 'wrongId'], mockObjectToSearch);
    }).toThrow(new Error('Invariant Violation: Could not find "wrongId" within object'));
  });
});
