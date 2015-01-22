# Tuxx/Stores

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-Stores">Requiring Stores</a></li>
      <li><a href="#Creating-Stores">Creating Stores</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#create-store-example">Create Stores Example</a></li>
          <li><a href="#Stores-createStore">METHOD Stores.createStore</a></li>
          <li><a href="#store">OBJECT: store</a>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#store-emitChange">METHOD: store.emitChange</a></li>
              <li><a href="#store-addChangeListener">METHOD: store.addChangeListener</a></li>
              <li><a href="#store-removeChangeListener">METHOD: store.removeChangeListener</a></li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#store-event-and-method-guidelines">Store Event and Method Guidelines</li>
  <li><a href="#TuxxStores-Complete-Example">TuxxStores Complete Example</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>Tuxx Stores provides an interface for abstracting away common store methods in the Flux architecture.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
### <a id="Requiring-Stores"></a>1) Requiring Stores [#](#Requiring-Stores)
Tuxx uses Facebook's [Flux](https://facebook.github.io/flux/) architecture and provides an interface for creating stores. This interface is exposed via:

```javascript
    var Stores = require('tuxx/Stores')
```

***

### <a id="Creating-Stores"></a>2) Creating Stores [#](#Creating-Stores)
The `Stores` object allows the user to create stores via invoking [Stores.createStore](#createStores). Stores are responsible for managing data and alerting views to when that data has changed in TuxedoJS. Pass in an object to the `createStore` method and it will return a new object that has been extended with the `emitChange`, `addChangeListener`, and `removeChangeListener` methods that are common to Flux stores. The Tuxx methods are added to the object being extended first, so if you want to overwrite Tuxx's implementation of one or all of those methods, you just need to provide your methods with those keys on the input object to `createStore`. Let's take a look at an example: [#](#create-store-example)
<a id="create-store-example"></a>

```javascript
    var messageStore = Stores.createStore({
      _messages: {},
      getAll: function () {
        return Object.keys(this._messages);
      }
    });
```

Below is the API documentation for this method.

***

### <a id="Stores-createStore"></a>3) Stores.createStore [#](#Stores-createStore)

```javascript
    var store = Stores.createStore(methods);
```

***

#### <a id="createStore-methods"></a>3.1) Parameter - `methods` - type: OBJECT - optional [#](#createStore-methods)
Methods and properties to extend the created store with. This object is optional and there are no expected keys. However normally, as in the case of the example above, a store will have properties associated with storing its data and methods for exposing that data to view components.

#### <a id="createStore-store"></a>Return - `store` - type: OBJECT [#](#createStore-store)
The `Stores.createStore` method returns a `store` instance which is described below.

***

### <a id="store"></a>4) store - type: OBJECT [#](#store)
The store has the following methods:

***

#### <a id="store-emitChange"></a>4.1) Method `store.emitChange` - type: FUNCTION [#](#store-emitChange)
Normally, it is common to invoke `emitChange` after data in the store is updated to alert the views that are listening to this store to request the new data. The change event can be either the default event string `CHANGE` or one provided by the user.

```javascript
    store.emitChange(EVENT_TYPE); // OR
    store.emitChange(); // will emit the default change event type string: 'CHANGE'
```

##### <a id="emitChange-EVENT_TYPE"></a>Parameter - `EVENT_TYPE` - type: STRING - optional [#](#emitChange-EVENT_TYPE)
Change event type string that will be broadcast by the store. Will trigger callbacks that are listening for this event type on the store. If no `EVENT_TYPE` is specified the default value of `CHANGE` will be used.

```javascript
    var newEventType = 'NEW_EVENT_TYPE';
    store.emitChange(newEventType);
```

***

### <a id="store-addChangeListener"></a>5) Method `store.addChangeListener` - type: FUNCTION [#](#store-addChangeListener)
The `addChangListener` method will invoke the provided callback function when the specified event type string is emitted. The change event can be either the default event string `CHANGE` or one provided by the user.

```
    store.addChangeListener(callback, EVENT_TYPE); // OR
    store.addChangeListener(callback); // this will add a listener for the default CHANGE event
```

***

##### <a id="addChangeListener-callback"></a>5.1) Parameter - `callback` - type: FUNCTION - required [#](#addChangeListener-callback)
The callback to invoke when the corresponding event is triggered.

```javascript
    var listenerCallback = function () {
      this.setState({ messages: MessageStore.all() });
    };

    store.addChangeListener(listenerCallback);
```

***

##### <a id="addChangeListener-EVENT_TYPE"></a>5.2) Parameter - `EVENT_TYPE` - type: STRING - optional [#](#addChangeListener-EVENT_TYPE)
Event string to add a listener callback to. If no event is passed in than the listener will be added to the default `CHANGE` event.

```javascript
    var listenerCallback = function () {
      this.setState({ messages: MessageStore.all() });
    };

    var newEventType = 'NEW_EVENT_TYPE';
    store.addChangeListener(listenerCallback, newEventType);
```

***

### <a id="store-removeChangeListener"></a>6) Method `store.removeChangeListener` - type: FUNCTION [#](#store-removeChangeListener)
Removes the passed in listener callback from the passed in event string. If no event is specified than the default `CHANGE` event is used.

```javascript
    store.removeChangeListener(callback, EVENT_TYPE);
```

***

##### <a id="removeChangeListener-callback"></a>6.1) Parameter - `callback` - type: FUNCTION - required [#](#removeChangeListener-callback)
The callback function that will be removed from the store's set of listeners.

```javascript
    var listenerCallback = function () {
      this.setState({ messages: MessageStore.all() });
    };

    store.addChangeListener(listenerCallback);
    store.removeChangeListener(listenerCallback);
```

***

##### <a id="removeChangeListener-EVENT_TYPE"></a>6.2) Parameter - `EVENT_TYPE` - type: STRING - optional [#](#removeChangeListener-EVENT_TYPE)
Store event type string that the listener will be removed from. If no `EVENT_TYPE` is specified the default value of `CHANGE` will be used.

```javascript
    var listenerCallback = function () {
      this.setState({ messages: MessageStore.all() });
    };

    var newEventType = 'NEW_EVENT_TYPE';
    store.addChangeListener(listenerCallback, newEventType);
    store.removeChangeListener(listenerCallback, newEventType);
```

***

## <a id="store-event-and-method-guidelines"></a>Store Event And Method Guidelines [#](#store-event-and-method-guidelines)
While it is possible to emit any kind of event you want from your stores in `Tuxx`. We strongly recommend that you stick with emitting just the default `CHANGE` event. If you are concerned about rendering components unnecessarily (a view responding to a `CHANGE` event even when the relevant data for the view hasn't updated), then use the `shouldComponentUpdate` life-cycle method to let the view decide for itself if it needs to update.

Next, we strongly recommend you equip the store with a variety of methods to expose exactly the kind of data needed by the views. If you come across a new view that needs a new piece of data in a store, add a method to the store to expose that new kind of data.

Why are these approaches better? For event emitting, tracking down bugs that pop up when an `EVENT_TYPE` string is misspelled can be a real pain and `React` is really, really fast (especially with `shouldComponentUpdate`), which means there is never anything to be gained by making sure only some components go and get new data from the store. Additionally, a store should never be making decisions about who needs to know what information. It simply needs to be responsible for tracking its data, emitting updates, and exposing its data.

For the methods, it allows you to program declaratively since you are asking for precisely the data you need from the store and it also significantly reduces the likelihood of bugs popping up in your app since you won't have data manipulations scattered across your different views.

```javascript
    //BAD
    var messageStore = Stores.createStore({
      _messages: [],

      get: function () {
        return this._messages;
      },

      onFirstMessageChange: function (newMessage) {
        this._messages.unshift(newMessage);
        this.emitChange('NEW_FIRST_MESSAGE');
      }
    });

    var getNewFirstMessageFromStore = function () {
      return messageStore.get()[0];
    };

    //Any mistake in our string spelling and this will silently fail
    messageStore.addChangeListener(getNewFirstMessageFromStore, 'NEW_FIRST_MESSAGE');

    //GOOD
    var messageStore = Stores.createStore({
      _messages: [],

      //provide declarative methods for requesting the data needed from the store
      getFirst: function () {
        return this._messages[0];
      },

      //always emit the default change event
      onFirstMessageChange: function (newMessage) {
        this._messages.unshift(newMessage);
        this.emitChange();
      }
    });

    var getNewFirstMessageFromStore = function () {
      return messageStore.getFirst();
    };

    messageStore.addChangeListener(getNewFirstMessageFromStore);
```

***

## <a id="TuxxStores-Complete-Example"></a>TuxxStores Complete Example [#](#TuxxStores-Complete-Example)
Taking everything we have learned let's look at a more realistic example of using TuxxStores.

```javascript
    var Stores = require('tuxx/Stores');

    var messageStore = Stores.createStore({
      _messages: [],

      allMessages: function () {
        return this._messages;
      },

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

    console.assert(messageStore.hasOwnProperty('emitChange'));
    console.assert(messageStore.hasOwnProperty('addChangeListener'));
    console.assert(messageStore.hasOwnProperty('removeChangeListener'));

    // In Tuxx we have better and more semantic methods for performing the below set of operations but let's use standard React syntax for the moment

    var React = require('tuxx/React');
    var Messages = require('./Messages.jsx'); // This component isn't built out here as it isn't explicitly needed to illustrate this example

    var MessageView = React.createOwnerClass({
      getInitialState: function () {
        return {
          messages: messageStore.getAll()
        };
      },

      listenerCallback: function () {
        this.setState({
          messages: messageStore.getAll()
        });
      },

      componentDidMount: function () {
        this.listenerCallback = this.listenerCallback.bind(this); //need to do this so we make sure listenerCallback is invoked with the proper context while it is in scope. If we do not do this, then we won't have the proper function when we go to remove it in the componentWillUnmount method
        messageStore.addChangeListener(this.listenerCallback);
      },

      componentWillUnmount: function () {
        messageStore.removeChangeListener(this.listenerCallback);
      },

      render: function () {
        return (
          <Messages messages={this.state.messages} />
        );
      }
    };
```

Hopefully this example helps to demonstrate some of the benefits of using the `createStore` method as it allows you to significantly reduce boilerplate when creating stores in your application.
