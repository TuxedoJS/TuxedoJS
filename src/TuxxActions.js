'use strict';

var invariant = require('tuxx/src/TuxxInvariant');
//require in instance of Flux Dispatcher
var Dispatcher = require('tuxx/src/Dispatcher.js');

//Actions OBJECT
var Actions = {};

//expose Dispatcher in case user needs it
Actions.__Dispatcher__ = Dispatcher;

//Actions.register FUNCTION
//@param storeToRegister OBJECT: TuxxStore for which actions will be registered, needed for waitFor syntax [ALTERNATE FUNCTION: function will be directly registered to dispatcher]
//@param categoriesToRegister OBJECT
  //expected keys:
    //ACTION:CATEGORY OBJECT: key will be an action category created with the function defined below, value will be an object
      //expected keys:
        //ACTION:VERBS FUNCTION: key wil be an action verb within the category of actions, value is function to call when associated action is dispatched.  function receives action payload OBJECT as input
Actions.register = function (storeToRegister, categoriesToRegister) {
  //if function is passed in, register that instead
  if (typeof storeToRegister === 'function') {
    return Dispatcher.register(storeToRegister);
  }
  //registers actions to dispatcher callback under object, invoked when corresponding action is passed in
  //define listener
  var listener = {};

  //get categories
  var categories = Object.keys(categoriesToRegister);
  var categoriesLength = categories.length;

  //declare variables
  var category, categoryToRegister, action, actions, actionsLength, i, j, createdCategory, createdAction;

  //loop through categories
  for (i = 0; i < categoriesLength; i++) {
    //loop through actions in category
    category = categories[i];
    //get category object to register
    categoryToRegister = categoriesToRegister[category];
    //get actions in category to register
    actions = Object.keys(categoryToRegister);
    actionsLength = actions.length;

    //loop through actions
    for (j = 0; j < actionsLength; j++) {
      action = actions[j];

      //get action string from Actions[category][action] store key in listener with value of callback
      //throw errors if category has not been created or does not have desired actions
      //get category
      createdCategory = Actions[category];
      //if category does not exist throw error
      invariant(createdCategory, '"%s" category has not been created yet', category);
      //get action in category
      createdAction = createdCategory[action];
      //if category does not have action throw error
      invariant(createdAction, '"%s" category does not have action "%s"', category, action);
      //register listener at key of action.type with value of callback
      listener[createdAction.type] = categoryToRegister[action];
    }
  }
  //register to Dispatcher and add registration key to store
  storeToRegister.__registerId__ = Dispatcher.register(function (payload) {
    //look for store architecture
    var tuxxArchitecture = storeToRegister.__tuxxArchitecture__;
    //if found invoke waitFor with registerested architecture for store
    if (tuxxArchitecture) {
      Dispatcher.waitFor(tuxxArchitecture);
    }
    //look for actionType in listener
    var registeredAction = listener[payload.action.actionType];
    //if found invoke callback CONTEXT: store, ARGUMENTS: body, [payload if needed]
    if (registeredAction) {
      return registeredAction.call(storeToRegister, payload.action.body, payload);
    }
  });
};

//Actions.createActionCategory FUNCTION
//@param actionCategoryProps OBJECT
  //expected keys:
    //category STRING: type of data actions will refer to, for example: 'messages', 'todos'
    //source STRING: source of action, for example: 'view_component', 'server_api'
    //actions ARRAY: verbs that will act on the category, for example: 'read', 'create', 'update', 'destroy'
Actions.createActionCategory = function (actionCategoryProps) {
  //creates object under Actions at the key of the category
  var category = actionCategoryProps.category;

  //throw error if category has already been defined
  invariant(!Actions[category], 'Action Category "%s" is already defined', category);

  //assign actionCategory to Actions and return it
  var actionCategory = Actions[category] = new ActionCategory(actionCategoryProps);
  return actionCategory;
};

//ActionCategory CONSTRUCTOR
//@param props OBJECT
  //expected keys:
    //category STRING
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
  var propActionsLength = propActions.length;
  for (var i = 0; i < propActionsLength; i++) {
    action = propActions[i];

    //construct full action name from CATEGORY_ACTION
    actionType = category + '_' + action;

    //bind actionType and assign actionType to action at key type
    //this is done to allow for semantically invoking actions directly
    var thisAction = this[action] = dispatchAction.bind(this, actionType, source);
    //store actionType on our function for reference in dispatching
    thisAction.type = actionType;
  }
};

//ActionCategory.before FUNCTION: replaces the current method at the passed in actionVerb with the callbackToInvokeBeforeDispatch and binds the previous actionVerb method to the first input of the callbackToInvokeBeforeDispatch
//@param actionVerb STRING: action verb to replace with callbackToInvokeBeforeDispatch, callbackToInvokeBeforeDispatch will be invoked before dispatching or before the previous 'before' callback on this action verb [ALTERNATE ARRAY: array of string action verbs to add callback onto, callback will be invoked before dispatching or before the previous 'before' callback on each action verb in the array]
//@param callbackToInvokeBeforeDispatch FUNCTION: callback to invoke before dispatching the action. Callback will receive two inputs:
  //1st input FUNCTION: the next callback to invoke in the callback chain. Pass an object into the function to invoke it with an actionBody
  //2nd input OBJECT: the actionBody. This will either be from the first invocation of the action or from the previous callback in the chain
ActionCategory.prototype.before = function (actionVerb, callbackToInvokeBeforeDispatch) {
  //if the actionverb is an array than invoke the before method with each element in the array and the callbackToInvokeBeforeDispatch
  if (Array.isArray(actionVerb)) {
    var actionVerbLength = actionVerb.length;
    for (var i = 0; i < actionVerbLength; i++) {
      this.before(actionVerb[i], callbackToInvokeBeforeDispatch);
    }
  } else {
    //if the actionVerb does not correspond to any action in this category throw an error
    var thisAction = this[actionVerb];
    invariant(thisAction, 'could not find action: "%s" within category: "%s" when attempting to register the before callback', actionVerb, this.__category__);

    //bind the current action method to the first input of the callbackToInvokeBeforeDispatch and store that as the new action method
    this[actionVerb] = callbackToInvokeBeforeDispatch.bind(this, thisAction);

    //reassign the type property which is needed for registering listeners
    this[actionVerb].type = thisAction.type;
  }
};

//ActionCategory.register FUNCTION: registers store with Actions and maps action verbs within this action category to callbacks
//@param storeToRegister OBJECT: TuxxStore for which actions will be registered, needed for waitFor syntax [ALTERNATE FUNCTION: function will be directly registered to dispatcher]
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
