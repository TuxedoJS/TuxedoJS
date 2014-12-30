//require in instance of Flux Dispatcher
var Dispatcher = require('./Dispatcher.js');

//Actions OBJECT
var Actions = {};

//expose Dispatcher in case user needs it
Actions.__Dispatcher__ = Dispatcher;

//Actions.register FUNCTION
//@param categoriesToRegister OBJECT [ALTERNATE FUNCTION: function will be directly registered to dispatcher]
  //expected keys:
    //ACTION:CATEGORY OBJECT: key will be an action category created with the function defined below, value will be an object
      //expected keys:
        //ACTION:VERBS FUNCTION: key wil be an action verb within the category of actions, value is function to call when associated action is dispatched.  function receives action payload OBJECT as input
Actions.register = function (storeToRegister, categoriesToRegister) {
  //if function is passed in, register that instead
  if (typeof storeToRegister === 'function') return Dispatcher.register(storeToRegister);
  //registers actions to dispatcher CB under object, invoked when corresponding action is passed in
  //define listener
  var listener = {};

  //get categories
  var categories = Object.keys(categoriesToRegister);
  var catLength = categories.length;

  var category, categoryToRegister, action, actions, actLength, i, j, createdCategory, createdAction;

  //loop through categories
  for (i = 0; i < catLength; i++){
    //loop through actions in category
    category = categories[i];
    //get category object to register
    categoryToRegister = categoriesToRegister[category];
    //get actions in category to register
    actions = Object.keys(categoryToRegister);
    actLength = actions.length;

    //loop through actions
    for (j = 0; j < actLength; j++){
      action = actions[j];

      //get action string from Actions[category][action] store key in listener with value of cb
      //throw errors if category has not been created or does not have desired actions
      createdCategory = Actions[category];
      if (createdCategory) {

        createdAction = createdCategory[action];
        if (createdAction) {

          listener[createdAction.type] = categoryToRegister[action];

        } else {
          throw new Error('"' + category + '" category does not have action "' + action + '"');
        }
      } else {
        throw new Error('"' + category + '" category has not been created yet');
      }
    }
  }
  //register to Dispatcher and add registration key to store
  storeToRegister.__registerId__ = Dispatcher.register(function(payload){
    //look for actionType in listener
    var registeredAction = listener[payload.action.actionType];
    //if found invoke cb CONTEXT: store, ARGUMENTS: body, [payload if needed]
    if (registeredAction) return registeredAction.call(storeToRegister, payload.action.body, payload);
  });
};

//Actions.createActionClass FUNCTION
//@param actionClass OBJECT
  //expected keys:
    //category STRING: type of data actions will refer to, for example: 'messages', 'todos'
    //source STRING: source of action
    //actions ARRAY: verbs that will act on the category, for example: 'read', 'create', 'update', 'destroy'
Actions.createActionClass = function (actionClass) {
  //creates object under Actions at the key of the category
  var category = actionClass.category;

  //throw error if category has already been defined
  if (Actions[category]) throw new Error('Action Category "' + category + '" is already defined');

  //assign actionCategory to Actions and return it
  var actionCategory = Actions[category] = new ActionCategory(actionClass);
  return actionCategory;
};

//ActionCategory CONSTRUCTOR
//@param props OBJECT
  //expected keys:
    //name STRING
    //source STRING
    //actions STRING or ARRAY
var ActionCategory = function (props) {
  //grab props for use in function
  var category = props.category;
  var source = props.source;

  //assign passed in properties to actionCategory instance
  this.__category__ = category;
  this.__source__ = source;

  //loop through actions and bind a separate function for each
  var action, actionType;
  var propActions = props.actions;
  var propActLength = propActions.length;
  for (var i = 0; i < propActLength; i++) {
    action = propActions[i];

    //construct full action name from CATEGORY_ACTION
    actionType = category + '_' + action;

    //bind actionType and assign actionType to action at key type
    this[action] = dispatchAction.bind(this, actionType, source);
    this[action].type = actionType;
  }

};

//ActionCategory.register FUNCTION
//@param actionsToRegister OBJECT keys are action verbs, values are callbacks to be invoked when action is dispatched
ActionCategory.prototype.register = function (storeToRegister, actionsToRegister) {
  var categoriesToRegister = {};
  //register this category with passed in actions
  categoriesToRegister[this.__category__] = actionsToRegister;
  Actions.register(storeToRegister, categoriesToRegister);
};

//dispatchAction FUNCTION
//@param actionType STRING should be bound by ActionCategory, actionType of action to be dispatched
//@param source STRING should be bound by ActionCategory, source of action to be dispatched
//@param body OBJECT body of action to be dispatched
var dispatchAction = function (actionType, source, body) {
  //define action
  var action = {
    actionType: actionType,
    body: body
  };
  //dispatch action and source
  Dispatcher.dispatch({
    source: source,
    action: action
  });
};

//export Actions
module.exports = Actions;
