'use strict';

var moduleToTest = 'tuxx/src/TuxxState';

jest.dontMock(moduleToTest);

describe('TuxState', function () {
  var stateMixin, callback;

  beforeEach(function () {
    // reset stateMixin before each test
    stateMixin = require(moduleToTest);
    // create state object for each test
    stateMixin.state = {
      'Pat': {
        'cat': {
          'name': 'Mr. Bigglesworth',
          'age': 10
        },
        'dog': {
          'age': 10
        },
        'squirrel': true,
        'pigeon': {
          'fat': true
        }
      },
      'Dmitri': {
        'cat': {
          'age': 12,
          'name': 'Spencer'
        }
      },
      'Gunnari': {
        'turtles': ['Pat', 'Spencer']
      }
    };
    // mimick getInitialState method of React Components and return fake data
    stateMixin.getInitialState = function () {
      return {
        'Pat': true,
        'Dmitri': true,
        'Gunnari': true,
        'Spencer': true
      };
    };
    // create mock of setState method
    stateMixin.setState = jest.genMockFunction();
    // create mock of replaceState method
    stateMixin.replaceState = jest.genMockFunction();
    // create optional callback argument that will be executed once setState is completed and the component is re-rendered
    callback = function () {
      return;
    };

  });

  describe('addState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToAdd = {
        'Pat': {
          'cat': {
            'age': 9
          }
        },
        'Dmitri': {
          'cat': {
            'name': '-Gunnari'
          }
        }
      };
      stateMixin.addState(propsToAdd, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 19
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
           'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer-Gunnari'
          }
        },
        'Gunnari': {
         'turtles': ['Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('subtractState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToSubtract = {
        'Pat': {
          'cat': {
            'age': 1
          },
          'dog': {
            'age': 7
          }
        },
        'Dmitri': {
          'cat': {
            'age': 2
          }
        }
      };
      stateMixin.subtractState(propsToSubtract, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 9
          },
          'dog': {
            'age': 3
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 10,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('multiplyState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToMultiply = {
        'Pat': {
          'cat': {
            'age': 2
          },
          'dog': {
            'age': 3
          }
        },
        'Dmitri': {
          'cat': {
            'age': 2
          }
        }
      };
      stateMixin.multiplyState(propsToMultiply, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 20
          },
          'dog': {
            'age': 30
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 24,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('divideState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToDivide = {
        'Pat': {
          'cat': {
            'age': 2
          },
          'dog': {
            'age': 30
          }
        },
        'Dmitri': {
          'cat': {
            'age': 2
          }
        }
      };
      stateMixin.divideState(propsToDivide, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 5
          },
          'dog': {
            'age': 0.3333333333333333
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 6,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('omitState', function () {
    it('should call replaceState with the proper inputs', function () {
      var propsToOmit = {
        'Pat': {
          'pigeon': true,
          'cat': true,
          'dog': {
            'age': true
          }
        },
        'Dmitri': true
      };
      stateMixin.omitState(propsToOmit, callback);
      var expectedProps = {
        'Pat': {
          'dog': {},
          'squirrel': true,
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer']
        }
      };
      expect(stateMixin.replaceState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('extendState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToExtend = {
        'Dmitri': {
          'birds': true
        },
        'Spencer': true
      };

      stateMixin.extendState(propsToExtend, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'birds': true
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer']
        },
        'Spencer': true
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('pushState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToPush = {
        'Gunnari': {
          'turtles': 'Snuggles'
        }
      };

      stateMixin.pushState(propsToPush, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer', 'Snuggles']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('popState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToPop = {
        'Gunnari': {
          'turtles': true
        }
      };

      stateMixin.popState(propsToPop, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('unshiftState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToUnshift = {
        'Gunnari': {
          'turtles': 'Snuggles'
        }
      };

      stateMixin.unshiftState(propsToUnshift, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Snuggles', 'Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('shiftState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToShift = {
        'Gunnari': {
          'turtles': true
        }
      };

      stateMixin.shiftState(propsToShift, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('spliceState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToSplice = {
        'Gunnari': {
          'turtles': [1, 1, 'Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.spliceState(propsToSplice, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Wilbert', 'Jane', 'Mufasa']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('concatToEndOfState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToConcat = {
        'Gunnari': {
          'turtles': ['Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.concatToEndOfState(propsToConcat, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer', 'Wilbert', 'Jane', 'Mufasa']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('concatToFrontOfState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToConcat = {
        'Gunnari': {
          'turtles': ['Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.concatToFrontOfState(propsToConcat, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Wilbert', 'Jane', 'Mufasa', 'Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('resetState', function () {
    it('should call replaceState with the proper inputs', function () {

      stateMixin.resetState(callback);
      var expectedProps = {
        'Pat': true,
        'Dmitri': true,
        'Gunnari': true,
        'Spencer': true
      };
      expect(stateMixin.replaceState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('State methods error handling', function () {
    it('should throw an error when a required argument is not passed in', function () {
      expect(function () {
        stateMixin.addState();
      }).toThrow(new Error('Invariant Violation: This function requires an object as an argument.'));
    });

    it('should throw an error when anything but an object is passed in as an argument', function () {
      expect(function () {
        stateMixin.addState([]);
      }).toThrow(new Error('Invariant Violation: This function requires an object as an argument.'));

      expect(function () {
        stateMixin.addState(88);
      }).toThrow(new Error('Invariant Violation: This function requires an object as an argument.'));

      expect(function () {
        stateMixin.addState('someString');
      }).toThrow(new Error('Invariant Violation: This function requires an object as an argument.'));
    });

    it('should throw an error when checking that the deepest keys must be numbers or strings', function () {
      expect(function () {
        var propsToAdd = {
          'Pat': {
            'cat': {
              'age': []
            }
          },
          'Dmitri': {
            'cat': {
              'name': '-Gunnari'
            }
          }
        };
        stateMixin.addState(propsToAdd, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "" because it is not of type number or of type string.'));

      expect(function () {
        var propsToAdd = {
          'Pat': {
            'cat': {
              'age': {}
            }
          },
          'Dmitri': {
            'cat': {
              'name': '-Gunnari'
            }
          }
        };
        stateMixin.addState(propsToAdd, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "[object Object]" because it is not of type number or of type string.'));
    });

    it('should throw an error when checking that the deepest keys must be numbers', function () {
      expect(function () {
        var propsToSubtract = {
          'Pat': {
            'cat': {
              'age': 'string'
            },
            'dog': {
              'age': 7
            }
          },
          'Dmitri': {
            'cat': {
              'age': 2
            }
          }
        };
        stateMixin.subtractState(propsToSubtract, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "string" because it is not of type number.'));

      expect(function () {
        var propsToMultiply = {
          'Pat': {
            'cat': {
              'age': []
            },
            'dog': {
              'age': 3
            }
          },
          'Dmitri': {
            'cat': {
              'age': 2
            }
          }
        };
        stateMixin.multiplyState(propsToMultiply, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "" because it is not of type number.'));

      expect(function () {
        var propsToDivide = {
          'Pat': {
            'cat': {
              'age': {}
            },
            'dog': {
              'age': 30
            }
          },
          'Dmitri': {
            'cat': {
              'age': 2
            }
          }
        };
        stateMixin.divideState(propsToDivide, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "[object Object]" because it is not of type number.'));
    });

    it('should throw an error when checking that a passed in object must contain at least one outer key that the current state holds', function () {
      expect(function () {
        var propsToExtend = {
          'Spencer': true
        };
        stateMixin.extendState(propsToExtend, callback);
      }).toThrow(new Error('Invariant Violation: At least one outer key must match an outer key in the current state. Use setState if you only wish to add new keys and not change existing keys.'));
    });

    it('should throw an error when checking that the deepest keys must not be an array or object', function () {
      expect(function () {
        var propsToPush = {
          'Gunnari': {
            'turtles': ['Snuggles']
          }
        };
        stateMixin.pushState(propsToPush, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "Snuggles" because it must not be an array or object.'));

      expect(function () {
        var propsToUnshift = {
          'Gunnari': {
            'turtles': {}
          }
        };

        stateMixin.unshiftState(propsToUnshift, callback);
      }).toThrow(new Error('Invariant Violation: Cannot perform operation on "[object Object]" because it must not be an array or object.'));
    });
  });
});
