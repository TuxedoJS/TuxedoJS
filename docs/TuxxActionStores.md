# Tuxx ActionStores
## Table of Contents
<ol>
  <li><a href="#Context">Context</a></li>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a></li>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-ActionStores">Requiring ActionStores</a></li>
      <li><a href="#Creating-ActionStores">Creating ActionStores</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#ActionStores-createStore">METHOD: ActionStores.createStore</a></li>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#storeProps">OBJECT: storeProps</a>
                <ol style="list-style-type:lower-roman">
                  <li><a href="#storeProps-register">METHOD: storeProps.register</a></li>
                </ol>
              </li>
            </ol>
        </ol>
      </li>
      <li><a href="#TuxxActionStores-Complete-Example">TuxxActionStores Complete Example</a></li>
    </ol>
</ol>

## <a id="Context"></a>Context [#](#Context)
Recall that [Tuxx Actions](https://tuxedojs.org/docs/TuxxActions) allow you to create, listen, and dispatch actions as per the `Tuxx` architecture.

```javascript
    var Actions = require('tuxx/Actions');

    var messageActions = Actions.createActionCategory({
      category: 'messages',
      source: 'message views',
      actions: ['get', 'create', 'delete']
    });
```

Well, with `ActionStores`, we provide an alternative approach to registering your stores with your actions.

***

## <a id="Premise"></a>Premise [#](#Premise)
>`TuxxActionStores` is a module providing the interface for creating stores that are pre-packaged with a `register` convenience method for automatically registering the store with actions.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
### <a id="Requiring-ActionStores"></a>1) Requiring ActionStores [#](#Requiring-ActionStores)
The interface for creating `ActionStores` is exposed via a `createStore` constructor function on the `ActionStores` object.

```javascript
    var ActionStores = require('tuxx/Stores/ActionStores');
```

***

### <a id="Creating-ActionStores"></a>2) Creating ActionStores [#](#Creating-ActionStores)
`ActionStores` are an implementation on top of the basic `TuxxStore`. Thus, they have all of the same properties. The only difference is that `ActionStores` expect to have a `register` method passed in. If this `register` key is defined, then the `ActionStore` will invoke the method with the store as the context and use the object the method returns to register the store with `TuxxActions`. Let's take a look at an example

```javascript
    var actionStore = ActionStores.createStore({
      _messages: [],

      onCreate: function (message) {
        this._messages.push(message);
        this.emitChange();
      },

      register: function () {
        return {
          messages: {
            create: this.onCreate
          }
        };
      }
    });
```

Below is the API documentation for this method.

***


### <a id="ActionStores-createStore"></a>3) ActionStores.createStore [#](#ActionStores-createStore)
Returns an `actionStore` instance based on the passed in `storeProps`.

```javascript
    var actionStore = ActionStores.createStore(storeProps);
```

***

#### <a id="storeProps"></a>3.1) Parameter - `storeProps` - type: OBJECT - required [#](#storeProps)
`StoreProps` is an object containing actions that will encapsulate the store's data, with an optional `register` method which, if provided, will automatically register all the actions with the newly created store. Let's see what this looks like:

```javascript
    var messageStoreProperties = {
      _messages: [],

      onCreate: function (message) {
        this._messages.push(message);
        this.emitChange();
      },

      register: function () {
        return {
          messages: {
            create: this.onCreate
          }
        };
      }
    };
```

***

##### <a id="storeProps-register"></a>3.1.1) Method - `storeProps.register` - type: FUNCTION - optional [#](#storeProps-register)
The `register` method is an optional key on the `storeProps` parameter which, if defined, will invoke `Actions.register`, passing in the store as the first argument and the object returned by this `storeProps.register` method as the second argument. Here is what the `register` method performs on the backend:

```javascript
    Actions.register(actionStore, actionStore.register.call(actionStore));
```

 Now let's look at an example of `storeProps.register`:

```javascript
    storeProps.register = function () {
      return {
        messages: {
          create: this.onCreate;
        }
      };
    };
```
Note that `this` in the above example refers to the store being created.

Furthermore, this syntax abstracts away even more complexity by allowing you to register listeners with one or multiple actions and one or multiple categories simultaneously.

```javascript
    {
      CATEGORY1: {
        CATEGORY1_ACTION1: this.ONTHISACTION,
        CATEGORY1_ACTION2: this.ONANOTHERACTION,
      },
      CATEGORY2: {
        ACTION1: this.ONFINALACTION
      }
    }
```

#### <a id="createStore-actionStore"></a>Return - `actionStore` - type: OBJECT [#](#createStore-actionStore)
Returns a `TuxxStore` instance.

***

## <a id="TuxxActionStores-Complete-Example"></a>TuxxActionStores Complete Example [#](#TuxxActionStores-Complete-Example)
Taking everything we have learned, let's look at a full example.

```javascript
    var ActionStores = require('tuxx/Stores/ActionStores');
    var Actions = require('tuxx/Actions');

    var messageActions = Actions.createActionCategory({
      category: 'messages',
      source: 'message views',
      actions: ['create']
    });

    var messageStoreProperties = {
      _messages: [],

      onCreate: function (message) {
        this._messages.push(message);
        this.emitChange();
      },

      register: function () {
        return {
          messages: {
            create: this.onCreate;
          }
        };
      }
    };

    var messageActionStore = ActionStores.createActionStore(messageStoreProperties);
```

Hopefully this shows the power of the `ActionStore`. It allows us to easily and semantically describe the action categories and verbs that our store is listening for and the callbacks it will invoke in response to those actions.
