//bindContextToCallback FUNCTION: binds the passed in context to the passed in callback function, array of callbacks, or methods in object of callbacks
//@param context OBJECT: context that will be bound to the passed in callback(s)
//@param callback FUNCTION: function that context will be bound to [ALTERNATE ARRAY of callbacks that context will be bound to, callbacks will be bound in place] [ALTERNATE OBJECT of callbacks that context will be bound to, callbacks will be bound in place]
module.exports = bindContextToCallback = function (context, callback) {
  var i, currentCallback;
  //if callback is an array than loop through each element and bind to all top level functions context to it in place
  if (Array.isArray(callback)) {
    var callbackLength = callback.length;
    for (i = 0; i < callbackLength; i++) {
      currentCallback = callback[i];
      //only bind if the element in the array is a function
      if (typeof currentCallback === 'function') {
        //bind in place in array
        callback[i] = currentCallback.bind(context);
      }
    }
  //if callback is an object than loop through keys and bind context to all top level methods in place
  } else if (typeof callback === 'object') {
    for (i in callback) {
      if (callback.hasOwnProperty(i)) {
        currentCallback = callback[i];
        //only bind if the element in the object is a method
        if (typeof currentCallback === 'function') {
          //bind in place in object
          callback[i] = currentCallback.bind(context);
        }
      }
    }
  } else {
    //if the callback is a function than bind it to context
    callback = callback.bind(context);
  }
  //return the bound function, array of bound functions, or object of bound methods
  return callback;
};
