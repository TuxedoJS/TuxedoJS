var assign = require('object-assign');

//mixin to perform type checking on nearestOwnerProps as well as perform checking on either nearestOwnerProps or props if the user is not interested in the source of the props
module.exports = {
  componentWillMount: function () {
    //get the nearestOwnerPropTypes from the component
    var nearestOwnerPropTypes = this.nearestOwnerPropTypes;
    //if nearestOwnerPropTypes is defined
    if (nearestOwnerPropTypes) {
      //check the nearestOwnerProps
      this._checkPropTypes(nearestOwnerPropTypes, this.nearestOwnerProps, 'nearestOwnerProps');
    }
    //get the anyPropTypes from the component
    var anyPropTypes = this.anyPropTypes;
    //if anyPropTypes is defined
    if (anyPropTypes) {
      //check both the nearestOwnerProps and props. Note that this.props is passed in last so that it overwrites matching keys with this.nearestOwnerProps
      this._checkPropTypes(anyPropTypes ,assign({}, this.nearestOwnerProps, this.props), 'props or nearestOwnerProps');
    }
  }
};
