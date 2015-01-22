# Tuxx/React.OwnerClass

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-OwnerClass">Requiring OwnerClass</a></li>
      <li><a href="#Creating-an-OwnerClass-Component">Creating an OwnerClass Component</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Creating-an-OwnerClass-Component-Example">Creating an OwnerClass Component Example</a></li>
          <li><a href="#React-createOwnerClass">METHOD: React.createOwnerClass</a></li>
          <li><a href="#createOwnerClass-ownerClassProps">OBJECT: ownerClassProps</a>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#ownerClassProps-connectOwnerToStore">METHOD: ownerClassProps.connectOwnerToStore</a></li>
              <li><a href="#connectOwnerToStore-Example-And-Guidelines">connectOwnerToStore Example and Guidelines</a></li>
              <li><a href="#ownerClassProps-registerOwnerProps">METHOD: ownerClassProps.registerOwnerProps</a></li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#TuxxOwnerClass-Complete-Example">TuxxOwnerClass Complete Example</a>
</ol>
## <a id="Premise"></a>Premise [#](#Premise)
>The `OwnerClass` is an opinionated [React](http://facebook.github.io/react/) class designed to manage state in an application. It is also an excellent class to use as an endpoint for a client side route in the app. The `OwnerClass` possesses methods that allow it to more easily connect with a store or stores and expose its properties to child components without having to cascade those properties down as per the usual `React` workflow.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
The `OwnerClass` is an extension on top of the `OwneeClass` and thus has all of the same methods and properties as well as those listed below. Please see the `OwneeClass` docs for further information on these properties.

### <a id="Requiring-OwnerClass"></a>1) Requiring OwnerClass [#](#Requiring-OwnerClass)
The `OwnerClass` is exposed as a method under `tuxx/React` via:

```javascript
    var React = require('tuxx/React');
    console.assert(React.createOwnerClass);
```

***

### <a id="Creating-an-OwnerClass-Component"></a>2) Creating an OwnerClass Component [#](#Creating-an-OwnerClass-Component)
The `React` object allows us to create `TuxxOwnerClass` components. These components will be the primary managers of state in your application. While it is possible to use state outside of an `OwnerClass`, there are powerful convenience methods provided with `OwnerClass` components that allow them to interact with stores, share properties, and update their state much more easily than with standard `React` components. Let's take a look at an example: [#](#Creating-an-OwnerClass-Component-Example)
<a id="Creating-an-OwnerClass-Component-Example"></a>

```javascript
    var roomStore = require('../stores/roomStore');
    var roomActions = require('../actions/roomActions');
    var Rooms = require('./Rooms');
    var React = require('tuxx/React');

    var RoomViewOwner = React.createOwnerClass({
      getInitialState: function () {
        return {
          rooms: roomStore.getAll()
        };
      },

      connectOwnerToStore: function () {
        return {
          store: roomStore,
          listener: function () {
            this.setState(this.getInitialState());
          }.bind(this)
        };
      },

      registerOwnerProps: function () {
        return {
          createRoom: roomActions.create
        };
      },

      render: function () {
        return (
          <Rooms rooms={this.state.rooms} />
        );
      }
    });
```

Some of this should look familiar as the `createOwnerClass` is an implementation on top of the `React.createClass` method. Which means that it has access to all of the same [lifecycle](http://facebook.github.io/react/docs/component-specs.html) methods as a normal `React` class. Additionally, it requires a `render` method just like any other `React` component.

You can also see that we are using `React's` [JSX](http://facebook.github.io/react/docs/displaying-data.html) syntax here. We are able to do this because when we require in our `tuxx/React` module we assign it to a variable name `React`. JSX automatically translates into `React.METHOD NAME`, thus by writing `var React = require('tuxx/React')` we can leverage JSX syntax.

If you are unfamiliar with `React` components please review their [docs](http://facebook.github.io/react/). Below is the API documentation for the `createOwnerClass` method.

***

### <a id="React-createOwnerClass"></a>3) React.createOwnerClass [#](#React-createOwnerClass)
Returns an `OwnerClass` based on the passed in `ownerClassProps`

```javascript
    var OwnerClass = React.createOwnerClass(ownerClassProps);
```

***

#### <a id="createOwnerClass-ownerClassProps"></a>3.1) Parameter - `ownerClassProps` - type: OBJECT - required [#](#createOwnerClass-ownerClassProps)
Properties of the `OwnerClass` to be created. Expected keys:

##### <a id="ownerClassProps-render"></a>Property - `ownerClassProps.render` - type: FUNCTION - required [#](#ownerClassProps-render)
As with any other `React` class, a [render](#http://facebook.github.io/react/docs/component-specs.html#render) method is required. This method is responsible for returning a `React Element` which can be rendered onto the DOM.

```javascript
    ownerClassProps.render = function () {
      return (
        <div>
          <h1>hello world</h1>
        </div>
      );
    };
```

##### <a id="ownerClassProps-LIFECYCLE_AND_SPECS"></a>Methods/Properties - `ownerClassProps.LIFECYCLE_AND_SPECS` - type: FUNCTIONs - optional [#](#ownerClassProps-LIFECYCLE_AND_SPECS)
As with any other `React` class, the `ownerClassProps` can optionally include `React` [lifecycle methods and specs](#http://facebook.github.io/react/docs/component-specs.html).

```javascript
    ownerClassProps.componentDidMount = function () {
      roomActions.get();
    };
```

***

##### <a id="ownerClassProps-connectOwnerToStore"></a>3.1) Method - `ownerClassProps.connectOwnerToStore` - type: FUNCTION or ARRAY of FUNCTIONs - optional [#](#ownerClassProps-connectOwnerToStore)
This method allows an `OwnerClass` to easily and semantically add and remove event type listeners for stores. The listeners will be added on `componentDidMount` and will be removed on `componentWillUnmount`. The `connectOwnerToStore` method must return an object which the `OwnerClass` will use to connect itself to the store. Alternatively, `connectOwnerToStore` can be an array of functions that return objects if the `OwnerClass` needs to connect to multiple stores. In either case, the function(s) will be invoked with the context of the Owner Component just as with any other `React` spec or lifecycle method.

```javascript
    ownerClassProps.connectOwnerToStore = function () {
      //'this' will be the Owner Component so we can invoke methods like this.setState
      return connectOwnerToStoreProps;
    };

    connectOwnerToStoreProps = {
      store: roomStore,
      //if there are more listeners then event types then each extra listener will be mapped to the last event type or vice versa
      listener: [ownerClassProps.onRoomStoreChange, ownerClassProps.onRoomStoreSpecialChange],
      event: ['CHANGE', 'SPECIAL_CHANGE']
    };
```

Alternatively, to connect an `OwnerClass` to multiple stores:

```javascript
    ownerClassProps.connectOwnerToStore = [
      function () {
        return {
          store: storeToConnectTo,
          listener: this.listenerForStoreToConnectTo
        };
      },

      function () {
        return {
          store: anotherStoreToConnectTo,
          listener: this.listenerForAnotherStoreToConnectTo
        };
      },
    ];
```

The `connectOwnerToStoreProps` object is described in full below.

###### <a id="connectOwnerToStoreProps-store"></a>Property - `connectOwnerToStoreProps.store` - type: OBJECT - required [#](#connectOwnerToStoreProps-store)
The store to add our listeners to.

###### <a id="connectOwnerToStoreProps-listener"></a>Property - `connectOwnerToStoreProps.listener` - type: FUNCTION or ARRAY of FUNCTIONs - required [#](#connectOwnerToStoreProps-listener)
Listener callback (or array of listener callbacks) to invoke when the corresponding event types are emitted from the store. If there is no `event` key then the listeners will be triggered when the default `CHANGE` event type is emitted. If there is an `event` key than the listener will be mapped to that event type. If an array of listeners is passed in than each listener will be mapped to the corresponding `event` in the event type array. If the listener array is longer than the event type array or only a single event type is passed in than each extra listener will be mapped to the single event type or last event type in the array.

```javascript
    connectOwnerToStoreProps.listener = function () {
      this.setState({
        messages: messageStore.getAll()
      });
    };
```

To add multiple listeners to a store.

```javascript
    connectOwnerToStoreProps.listener = [
      function () {
        this.setState({
          messages: messageStore.getAll()
        });
      },

      function () {
        this.setState({
          messages: messageStore.getSpecialMessage()
        });
      }
    ];
```

###### <a id="connectOwnerToStoreProps-event"></a>Property - `connectOwnerToStoreProps.event` - type: STRING or ARRAY of STRINGs - optional [#](#connectOwnerToStoreProps-event)
Event(s) to bind the `listener` callback(s) to for the store. If there is no `event` key then the listeners will be triggered when the default `CHANGE` event type is emitted. If there is an `event` key then the listener will be mapped to that event. If an array of event types is passed in than each event type  will be mapped to the corresponding listener in the listener array. If the event type array is longer than the listener array or only a single listener is passed in than each extra event type will be mapped to the single listener or last listener in the array.

```javascript
    connectOwnerToStoreProps.event = 'SPECIAL_CHANGE_EVENT';
```

To add multiple event types to listen to.

```javascript
    connectOwnerToStoreProps.listener = ['SPECIAL_CHANGE_EVENT', 'ANOTHER_CHANGE_EVENT'];
```

***

##### <a id="connectOwnerToStore-Example-And-Guidelines"></a>3.2) connectOwnerToStore Example and Guidelines [#](#connectOwnerToStore-Example-And-Guidelines)
While it is possible to add listeners to a wide range of store event types, we strongly recommend that you stick with only listening to the default `CHANGE` event type from the store(s). This listener should perform the request to get all the data that will be needed from the store.

Why do this? Because it is extremely difficult to reason about which event types will be emitted from a store in response to which updates. Additionally, it results in difficult to track down errors if a string is misspelled. If you are concerned about your components getting new data from the store even when the relevant data for them has not updated than we recommend using the [shouldComponentUpdate](http://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) lifecycle method. Additionally, `React` is very fast and oftentimes there won't be any need for `shouldComponentUpdate`.

```javascript
    //BAD
    connectOwnerToStore.listener = [onChangeEvent, onAnotherEvent, onYetAnotherEvent];
    connectOwnerToStore.event = ['CHANGE', 'ANOTHER EVENT', 'YET ANOTHER EVENT'];
    //If we misspell any event type strings then our listeners won't fire

    //GOOD
    connectOwnerToStore.listener = onChangeEvent
    //and then only emit default change event types from the store
```

***

##### <a id="ownerClassProps-registerOwnerProps"></a>3.3) Method - `ownerClassProps.registerOwnerProps` - type: FUNCTION - optional [#](#ownerClassProps-registerOwnerProps)
The `registerOwnerProps` method is invoked with the context of the component and allows an `OwnerClass` to automatically expose its properties to its child components (direct or otherwise).

In normal `React` applications the only way to expose methods to children components is by passing those properties down into those children. In large applications this can be a fragile and error prone process since each component needs to make sure to cascade down the necessary methods to its children. `React` attempts to solve this via `Spread` syntax, but this only works in some cases and still makes properties extremely difficult to reason about. Most importantly, this makes components less reusable and less semantic since they might require methods just so they can expose those methods to their children without using them at all.

TuxedoJS solves this problem with the `registerOwnerProps` method which allows `OwnerClass` components to describe the methods they want to automatically share with their children. This method returns an object and child components will go to their nearest parent `OwnerClass` and get this object automatically when they mount. The object is stored on the child component at the key of `nearestOwnerProps`. Additionally, children will have access to this `nearestOwnerProps` object even if they themselves are `OwnerClass` components. This means you can cascade properties from one `OwnerClass` to the next by submitting methods in the `nearestOwnerProps` object with the object you return from `registerOwnerProps`.

NOTE: `nearestOwnerProps` should be treated as immutable just like standard component props. Thus, you should never modify the `nearestOwnerProps` object. It is designed to store static methods and data.

```javascript
    ownerClassProps.registerOwnerProps = function () {
      //'this' context will be the owner component
      return {
        createRoom: this.createRoom.bind(this),
        deleteRoom: this.deleteRoom.bind(this),
        updateRoom: this.updateRoom.bind(this)
      };
    };
```

Now, children of the `OwnerClass` can access these props via:

```javascript
    this.nearestOwnerProps.createRoom;
    this.nearestOwnerProps.deleteRoom;
    this.nearestOwnerProps.updateRoom;
```

***

#### <a id="createOwnerClass-OwnerClass"></a>Return - `OwnerClass` - type: OBJECT [#](#createOwnerClass-OwnerClass)
The `createOwnerClass` method returns a `TuxxOwnerClass` which is an extension on top of a `React` Class. You can then simply use it in render methods as you would any other `React` Class.

***

### <a id="TuxxOwnerClass-Complete-Example"></a>4) TuxxOwnerClass Complete Example [#](#TuxxOwnerClass-Example)
Taking all that we have learned so far let's take a look at a more realistic example.

```javascript
    var React = require('tuxx/React');
    var roomStore = require('../stores/RoomStore');  //room store that we will get data from
    var roomActions = require('../actions/RoomActions'); //room actions that we will dispatch
    var RoomCreateForm = require('./RoomCreateForm');
    var Rooms = require('./Rooms');

    var RoomViewOwner = React.createOwnerClass({
      getInitialState: function () {
        return {
          rooms: roomStore.getAll()
        };
      },

      componentDidMount: function () {
        roomActions.get();
      },

      connectOwnerToStore: function () {
        return {
          store: roomStore,
          listener: function () {
            this.setState({
              rooms: roomStore.getAll()
            });
          }.bind(this)
        };
      },

      registerOwnerProps: function () {
        return {
          handleCreate: roomActions.create,
          handleUpdate: roomActions.update,
          handleDelete: roomActions.delete
        };
      },

      render: function () {
        return (
          <div>
            <RoomCreateForm />
            <Rooms rooms={this.state.rooms} />
          </div>
        );
      }
    });

    React.render(<RoomViewOwner />, document.getElementById("main"));
```

Hopefully this shows some of the power of the `OwnerClass`. Firstly, we would normally have to do the work of adding and removing listeners to/from our store within the `componentDidMount` and `componentWillUnmount` lifecycle methods. Thanks to the `connectOwnerToStore` method that is no longer necessary.

Secondly, we would normally have to pass down all of the necessary methods that our child components need to access to. In larger and larger apps this process becomes more difficult and harder to scale over time. However, with the `registerOwnerProps` method, we can automatically expose the necessary methods to our child components without having to cascade down our methods through a network of components.
