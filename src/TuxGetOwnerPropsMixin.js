module.exports = {
  componentWillMount: function () {
    var owner = this._owner;
    if (owner) {
      if (owner.__tuxIsOwnerComponent__) {
        this.nearestOwnerProps = owner.ownerProps;
      } else {
        this.nearestOwnerProps = owner.nearestOwnerProps;
      }
    }
  }
};
