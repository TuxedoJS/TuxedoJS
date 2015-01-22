# Tuxx/Actions

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-Actions">Requiring Actions</a></li>
      <li><a href="#The-Actions-Dispatcher">The Actions Dispatcher</a></li>
      <li><a href="#Creating-Action-Categories">Creating Action Categories</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#create-action-category-example">Create Action Category Example</a></li>
          <li><a href="#Actions-createActionCategory">METHOD: Actions.createActionCategory</a></li>
          <li><a href="#actionCategory">OBJECT: actionCategory</a>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#actionCategory-register">METHOD: ActionCategory.register</a></li>
              <li><a href="#actionCategory-ACTION">METHOD: ActionCategory.ACTION_VERB</a></li>
              <li><a href="#actionCategory-before">METHOD: ActionCategory.before</a></li>
            </ol>
          </li>
        </ol>
      </li>
      <li><a href="#Registering-with-Actions">Registering with Actions</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Register-with-Actions-example">Register with Actions Example</a></li>
          <li><a href="#Actions-register">METHOD: Actions.register</a></li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#Actions-Usage-Guidelines">Actions Usage Guidelines</a></li>
  <li><a href="#TuxxActions-Complete-Example">TuxxActions Complete Example</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>Tuxx Actions is a module providing the interface for creating, listening to, and dispatching actions as per the Flux architecture within Tuxx.

## <a id="Implementation"></a>Implementation [#](#Implementation)
### <a id="Requiring-Actions"></a>1) Requiring Actions [#](#Requiring-Actions)
Tuxx uses Facebook's [Flux](https://facebook.github.io/flux/) architecture. However Tuxx abstracts the interactions with the Dispatcher away via an Actions interface. This interface is exposed via:

```javascript
    var Actions = require('tuxx/Actions');
```

***

### <a id="The-Actions-Dispatcher"></a>2) The Actions Dispatcher [#](#The-Actions-Dispatcher)
In `Tuxx` there is no direct interaction with the `Dispatcher` as there is in a normal `Flux` application. Instead the `Actions` object provides all functionality related to the Dispatcher (both triggering and registering listeners for events). The `Actions` object simply uses the `Dispatcher` on the backend to handle these operations. The `Actions` object provides tools for registering callbacks with its dispatcher and creating `actionCategories`, which are responsible for dispatching events. The `actionCategories` handle the logic associated with interacting with some category of data in the app. For example, you would have an `actionCategory` for 'messages', another one for 'todos', another one for 'users', etc. The `actionCategory` is described in full below.

***

### <a id="Creating-Action-Categories"></a>3) Creating Action Categories [#](#Creating-Action-Categories)
The crucial concept to understand in Tuxx Actions is the `actionCategory`. An `actionCategory` provides the methods to dispatch events and register listeners for those events (registering can also be done through the `Actions` object). The `Actions` object allows the user to create categories of actions via [Actions.createActionCategory](#createActionCategory). Think of categories as the nouns upon which your action verbs act. For example `messages`, `rooms`, `todos`, `users`. You then assign a list of verbs to that category, for example `create`, `read`, `update`, and `destroy`. Lastly, you can optionally define a source for the actions, which can be helpful metadata for your store callbacks. Let's take a look at an example: [#](#create-action-category-example)
<a id="create-action-category-example"></a>

```javascript
    var todoActions = Actions.createActionCategory({
      category: 'todos',
      source: 'todo_views',
      actions: ['add', 'remove', 'edit', 'get']
    });
```

The `todoActions` object will possess all of the logic necessary to dispatch todo related events and tools for registering listeners for those events (registering can also be done through the `Actions` object). Below is the API documentation for this method.

***

### <a id="Actions-createActionCategory"></a>4) Actions.createActionCategory [#](#Actions-createActionCategory)
Returns an `actionCategory` instance based on the passed in `actionCategoryProps`.

```javascript
    var actionCategory = Actions.createActionCategory(actionCategoryProps);
```

#### <a id="actionCategoryProps"></a>Parameter - `actionCategoryProps` - type: OBJECT - required [#](#actionCategoryProps)
Properties of the actionCategory to be created. Expected keys:
##### <a id="actionCategoryProps-category"></a>Property - `actionCategoryProps.category` - type: STRING - required [#](#actionCategoryProps-category)
Name of the category of actions. Represents the noun to which action verbs will be applied. For example: 'messages', 'todos', 'users', etc. Must be unique for each actionCategory.

```javascript
    actionCategoryProps.category = 'todos';
```

##### <a id="actionCategoryProps-actions"></a>Property - `actionCategoryProps.actions` - type: ARRAY of STRINGs - required [#](#actionCategoryProps-actions)
Array of action verb strings. Represents the actions to perform on the noun defined in category.

```javascript
    actionCategoryProps.actions = ['add', 'remove', 'edit', 'get'];
```

##### <a id="actionCategoryProps-source"></a>Property - `actionCategoryProps.source` - type: STRING - optional [#](#actionCategoryProps-source)
Action source. Represents what will be generating these verbs, which can be useful for organizing action handlers. Some generic sources might be: 'view_components', 'external_api', 'backend_api'

```javascript
    actionCategoryProps.source = 'todo_views';
```

#### <a id="actionCategoryReturn"></a>Return - `actionCategory` - type: OBJECT [#](#actionCategoryReturn)
Method returns an actionCategory object which is described below.

***

### <a id="actionCategory"></a>5) actionCategory - type: OBJECT [#](#actionCategory)
The actionCategory provides all of the logic associated with dispatching events, as well as tools for registering listeners to its events (which can also be done through the `Actions` object). It has the following parameters:

#### <a id="actionCategory-category"></a>Property - `actionCategory.__category__` - type: STRING [#](#actionCategory-category)
The passed in category property is mapped to this key. You should not normally need access to this property.

```javascript
    console.assert(actionCategory.__category__ === 'todos');
```

#### <a id="actionCategory-source"></a>Property - `actionCategory.__source__` - type: STRING [#](#actionCategory-source)
The passed in source is mapped here or it is left undefined if no source is passed in. You should not normally need access to this property.

```javascript
    console.assert(actionCategory.__source__ === 'todo_views');
```

***

#### <a id="actionCategory-register"></a>5.1) Method - `actionCategory.register` - type: FUNCTION [#](#actionCategory-register)
An actionCategory instance is able to invoke [Actions.register](#Actions-register) through its own `register` method. In which case it will use its own category as the category of actions to register to the Actions object. See below for more information regarding the [Actions.register](#Actions-register) method.

```javascript
    actionCategory.register(storeToRegister, actionVerbCallbackMap);
```

This method is equivalent to:

```javascript
    Actions.register(storeToRegister, {
      todos: actionVerbCallbackMap
    });
```

***

#### <a id="actionCategory-ACTION"></a>5.2) Method - `actionCategory.ACTION_VERB` - type: FUNCTION [#](#actionCategory-ACTION)
Each passed in action verb in the actions array becomes a key within the actionCategory that maps to a method which can be invoked to dispatch the corresponding action.

**NOTE**: Because of this, if you pass in the strings `register` or `before` in your action verb array you will overwrite the `before` and `register` methods on the returned `actionCategory`.

```javascript
    actionCategory.add(actionBody); //OR
    actionCategory.update(actionBody); //ETC
```

##### <a id="ACTION-actionBody"></a>Parameter - `actionBody` - type: OBJECT - optional [#](#ACTION-actionBody)
Action body which will be passed in to any listeners on this action.

```javascript
    var newTodo = {
      text: 'the actionCategory.add method will invoke the storeToRegister.onAdd '
      + 'callback and will pass this newTodo object into it'
    };
    actionCategory.add(newTodo);
```

##### <a id="ACTION-type"></a>Property - `ACTION_VERB.type` - type: STRING [#](#ACTION-type)
This property is attached to each action verb method and represents the full name of the action `(category + '_' + action)`. TuxedoJS uses this to find the callbacks that are listening to the dispatched action. You should not normally need access to this property.

```javascript
    console.assert(actionCategory.add.type === 'todos_add');
```

***

#### <a id="actionCategory-before"></a>5.3) Method - `actionCategory.before` - type: FUNCTION [#](#actionCategory-before)
Accepts an action verb string or array of action verbs and a callback, it invokes the callback before dispatching the action when the action method is invoked. The major use case for the `before` callback is to allow actions to invoke async functions (such as Ajax requests) and then dispatch the results of those requests. The `before` method will throw an error if it cannot find the passed in `actionVerb` in the `actionCategory`.

```javascript
    actionCategory.before(actionVerb, callbackToInvokeBeforeDispatching);
```

##### <a id="before-actionVerb"></a>Parameter - `actionVerb` - type: STRING or ARRAY of STRINGs - required [#](#before-actionVerb)
Action (or array of actions) which will invoke the passed in callback before dispatching their corresponding actions.

```javascript
    actionVerb = 'add'; //OR
    actionVerb = ['add', 'remove'];
```

***

##### <a id="before-callbackToInvokeBeforeDispatching"></a>5.3.1) Parameter - `callbackToInvokeBeforeDispatching` - type: FUNCTION - required [#](#before-callbackToInvokeBeforeDispatching)
Function to be invoked before the action to dispatch. Multiple `callbackToInvokeBeforeDispatching` callbacks can be registered to an action via the `before` method and they will be invoked in reverse order of how they are registered. The last function to be invoked will dispatch the action. This chaining occurs by having each callback invoke the next callback in the series and, optionally, pass in an `actionBody` to it. This syntax allows for asynchronous callback chaining. The inputs to the callback are described below

```javascript
    callbackToInvokeBeforeDispatching(nextCallbackInBeforeChain, actionBody);
```

###### <a id="callbackToInvokeBeforeDispatching-nextCallbackInBeforeChain"></a>Parameter - `nextCallbackInBeforeChain` - type: FUNCTION [#](#callbackToInvokeBeforeDispatching-nextCallbackInBeforeChain)
The next callback in the chain for this action. The callback will receive whatever `actionBody` object is passed into it when invoked. This allows chained callbacks to modify/replace submitted inputs.

```javascript
    nextCallbackInBeforeChain(actionBody);
```

###### <a id="callbackToInvokeBeforeDispatching-actionBody"></a>Parameter - `actionBody` - type: OBJECT [#](#callbackToInvokeBeforeDispatching-actionBody)
This will either come from the input that the action was invoked with or the prior `before` callback that invoked this function.

```javascript
    actionBody = {text: 'new body to pass into the next callback'};
```

Here is a complete example of the before method.

```javascript
    actionCategory.before('add', function (nextCallbackToInvokeBeforeDispatching, actionBody) {

      console.assert(actionBody.text === 'text passed in from action or last before callback');

      nextCallbackToInvokeBeforeDispatching({text: 'invoking dispatch or next callback with new body.'
      + '  If invoking dispatch storeToRegister.onAdd will receive this instead'});
    });
```

***

### <a id="Registering-with-Actions"></a>6) Registering with Actions [#](#Registering-with-Actions)
The user can then register a listener to some or all of the verbs in one or multiple action categories via [Actions.register](#Actions-register). Listeners registered to an action will be invoked with the `actionBody` when the action is dispatched. The order by which listeners receive the action is determined by the store dependencies specified by TuxxArchitecture. Let's take a look at an example: [#](#Register-with-Actions-example)
<a id="Register-with-Actions-example"></a>

```javascript
    var todoStore = require('../stores/todoStore');
    Actions.register(todoStore, {
      todos: {
        add: todoStore.onAdd,
        remove: todoStore.onRemove
      },

      otherCategory: {
        otherAction: todoStore.onOtherAction
      }
    });
```

Below is the API documentation for this method.

***

### <a id="Actions-register"></a>7) Actions.register [#](#Actions-register)
Registers the passed in store to the `Actions` object and maps store callbacks to action verbs. This method will throw an error if it cannot find a passed in category or action within a category.

```javascript
    Actions.register(storeToRegister, mapCallbacksToCategoriesAndActions);
```

#### <a id="register-storeToRegister"></a>Parameter - `storeToRegister` - type: OBJECT - required [#](#register-storeToRegister)
The store to register with our `Actions` object. This object is required because the registration method needs to attach a key to the store that it can lookup later for the TuxxArchitecture methods. NOTE: this also means that the same store should never be registered multiple times as it will result in its id being overwritten.

```javascript
    var storeToRegister = require('../stores/todoStore');
```

#### <a id="register-mapCallbacksToCategoriesAndActions"></a>Parameter - `mapCallbacksToCategoriesAndActions` - type: OBJECT - required [#](#register-mapCallbacksToCategoriesAndActions)
This object's top level keys are the names of some/all action categories. Those keys map to objects whose keys are actions within the corresponding category. Those keys map to callbacks to invoke when the corresponding action within that category is dispatched. The callbacks will be invoked with the context of the `storeToRegister` by default and will receive the `actionBody` and `payload` (described below) when the action is invoked.

```javascript
    var mapCallbacksToCategoriesAndActions = {
      todos: {
        add: callbackToInvokeOnDispatch,
        remove: callbackToInvokeOnTodosRemoveDispatch
      },

      messages: {
        get: callbackToInvokeOnMessagesGetDispatch
      }
    };
```

***

##### <a id="mapCallbacksToCategoriesAndActions-calbackToInvokeOnDispatch"></a>7.1) Parameter - `callbackToInvokeOnDispatch` - type: OBJECT - required [#](#register-mapCallbacksToCategoriesAndActions)
The callback to map to the corresponding action key in the `mapCallbacksToCategoriesAndActions` object. When the action is dispatched, the `callbackToInvokeOnDispatch` will receive an `actionBody` (if the action was dispatched with a body), and an action `payload`, which contains the `actionBody` as well as meta-data about the action.

```
   callbackToInvokeOnDispatch(actionBody, payload);
```

###### <a id="calbackToInvokeOnDispatch-actionBody"></a>Parameter - `actionBody` - type: OBJECT [#](#calbackToInvokeOnDispatch-actionBody)
If the action is dispatched with a passed in object than the callback will receive this object.

```javascript
    actionCategory.add({text: 'I will be passed into callbackToInvokeOnDispatch'});
```

###### <a id="calbackToInvokeOnDispatch-payload"></a>Parameter - `payload` - type: OBJECT [#](#calbackToInvokeOnDispatch-actionBody)
Listeners will also receive the full action payload as a second argument. Normally this action shouldn't be needed but if special operations are needed based on the action source than use the `payload` to access the source.

```javascript
    console.assert(payload.action.actionType === 'todos_add');
    console.assert(payload.action.body === actionBody);
    console.assert(payload.source === 'todo_views');
```

Let's take a look at an example:

```javascript
    var todoStore = require('../stores/todoStore');

    Actions.register(todoStore, {
      todos: {
        add: function (actionBody, payload) {
          console.assert(actionBody.text === 'new todo');
          console.assert(payload.action.body === actionBody);
          console.assert(payload.action.actionType === 'todos_add');
        }
      }
    });

    actionCategory.add({text: 'new todo'});
```

Note that, as discussed [previously](#actionCategory-register), actionCategories have a `register` method which will provide their own category as the outermost object in the `mapCallbacksToCategoriesAndActions` object. Thus, the above example is equivalent to:

```javascript
    var todoStore = require('../stores/todoStore');

    actionCategory.register(todoStore, {
      add: function (actionBody, payload) {
        console.assert(actionBody.text === 'new todo');
        console.assert(payload.action.body === actionBody);
        console.assert(payload.action.actionType === 'todos_add');
      }
    });

    actionCategory.add({text: 'new todo'});
```

***

## <a id="Actions-Usage-Guidelines"></a>Actions Usage Guidelines [#](#Actions-Usage-Guidelines)
When using `Actions` we highly recommend finding the categories of data your app will interact with and creating an `actionCategory` for each data type. Sometimes `actionCategories` will not overlap exactly with stores and that is totally acceptable.

The real key with `actionCategories` is to take advantage of the `before` method to wrap up all of the business logic associated with an action verb so that it is totally encapsulated. This produces an extremely clean division of concerns wherein your views simply dispatch events (not knowing anything about what work that entails), your stores simply get the data from events (not knowing anything about what work went into generating that data), and your actions simply do the work of gathering and dispatching data (not knowing anything about what triggered the action or who needs the data). The following example helps to demonstrate how `Actions` can be used to great effect in an app.

***

## <a id="TuxxActions-Complete-Example"></a>TuxxActions Complete Example [#](#TuxxActions-Complete-Example)
Taking everything we have learned let's look at a more realistic example of using TuxxActions.

```javascript
    var Actions = require('tuxx/Actions');
    var Stores = require('tuxx/Stores');

    var messageStore = Stores.createStore({
      _messages: [],

      //the messageStores callbacks for the corresponding actions
      onGet: function (data) {
        this._messages = data.messages;
        this.emitChange();
      },

      onCreate: function (message) {
        this._messages.push(message);
        this.emitChange();
      },

      onDelete: function (message) {
        this._messages.splice(message.id, 1);
        this.emitChange();
      }
    });

    var messageActions = Actions.createActionCategory({
      category: 'messages',
      source: 'message components',
      actions: ['get', 'create', 'delete']
    });

    messageActions.register(messageStore, {
      get: messageStore.onGet,
      create: messageStore.onCreate,
      delete: messageStore.onDelete
    });

    //the messageActions category wraps all of the business logic associated with messages, fully encapsulating all of the work associated with an app action
    messageActions.before('get', function (nextCallback, actionBody) {
      ajaxRequest('/messages', 'GET').then(function (results) {
        nextCallback(results.data); //dispatch results of Ajax
      });
    });

    messageActions.before('create', function (nextCallback, actionBody) {
      ajaxRequest('/messages', 'POST', actionBody).then(function (results) {
        nextCallback(results.data); //dispatch results of Ajax
      });
    });

    messageActions.before('delete', function (nextCallback, actionBody) {
      ajaxRequest('/messages', 'DELETE', actionBody).then(function (results) {
        nextCallback(results.data); //dispatch results of Ajax
      });
    });

    messageActions.get(); //will trigger Ajax request to get messages
    messageActions.create({text: 'I am being dispatched to message.create listeners'); //will trigger Ajax request to create message
    messageActions.delete({id: 0}); //will trigger Ajax request to delete message
```

Hopefully this example helps to demonstrate some of the real power of using the `before` method. By invoking our Ajax request in the before callback we are able to fully encapsulate the work involved in a particular app action without forcing our action invokers or listeners to know anything about the details of the action. This helps our app stay modular, allowing our components to manage rendering, our stores to manage data, and our actions to manage events.
