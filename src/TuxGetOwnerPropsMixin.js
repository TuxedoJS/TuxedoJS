//getOwnerPropsMixin OBJECT: adds mixin to React class that will attach the nearestOwner's ownerProps under the key of nearestOwnerProps
module.exports = {
  //add property under componentWillMount so that other lifecycle methods will be able to access it
  componentWillMount: function () {
    var owner = this._owner;
    //if the owner is an OwnerComponent get its ownerProps, otherwise get its nearestOwnerProps
    if (owner) {
      //approach takes advantage of cascading order of componentWillMount invocations.  Since componentWillMount is called on an owner before its ownee, a component can just read from its owner to get the needed props
      if (owner.__tuxIsOwnerComponent__) {
        this.nearestOwnerProps = owner.ownerProps;
      } else {
        this.nearestOwnerProps = owner.nearestOwnerProps;
      }
    }
  }
};
