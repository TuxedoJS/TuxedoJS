var bindContextToCallback = require('./TuxBindContextToCallback');

//getOwnerPropsMixin OBJECT: adds mixin to React class that will attach the nearestOwner's __tuxOwnerProps__ under the key of nearestOwnerProps
//If component is a tux Owner Component:
//expected Key:
// registerOwnerProps FUNCTION: returns an OBJECT that represents the properties the owner will expose to its direct Ownees. The function will be invoked with the context of the owner component and all top level methods in the object will be bound to the component context
module.exports = {
  //add property under componentWillMount so that other lifecycle methods will be able to access it
  componentWillMount: function () {
    var owner = this._owner;
    //if the owner is an OwnerComponent get its __tuxOwnerProps__, otherwise get its nearestOwnerProps
    while (owner) {
      //approach takes advantage of cascading order of componentWillMount invocations.  Since componentWillMount is called on an owner before its ownee, a component can just read from its owner to get the needed props
      var nearestOwnerProps = owner.nearestOwnerProps;
      if (owner.__tuxIsOwnerComponent__) {
        this.nearestOwnerProps = owner.__tuxOwnerProps__;
        break;
      } else if (nearestOwnerProps) {
        this.nearestOwnerProps = nearestOwnerProps;
        break;
      }
      owner = owner._owner;
    }
    //if this component is a owner component
    if (this.__tuxIsOwnerComponent__) {
      //invoke registerOwnerProps after getting nearestOwnerProps so that owner can cascade down nearestOwnerProps to its direct Ownees
      var __tuxOwnerProps__ = this.registerOwnerProps.call(this);
      //loop through top level keys in returned __tuxOwnerProps__ and bind all methods to component context using bindContextToCallback
      bindContextToCallback(this, __tuxOwnerProps__);
      //assign object to key of __tuxOwnerProps__ on component
      this.__tuxOwnerProps__ = __tuxOwnerProps__;
    }
  }
};
