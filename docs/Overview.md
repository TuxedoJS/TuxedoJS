# TuxedoJS In a Nutshell
>`TuxedoJS` is a client-side CommonJS based web development framework built on Facebook's awesome `React` view-layer and `Flux` Architecture. It provides a semantic interface for working with `Flux` and augmented `React` components for managing different aspects of the view logic. `Tuxx` also provides some powerful prebuilt animation components that make animating transitions in `React`  a synch. Lastly, `TuxedoJS` leverages CommonJS modules to provide a completely modular framework which means, unlike other popular frameworks, you only load the pieces of `Tuxx` you actually intend to use.

***

## The React View Layer
`TuxedoJS` leverages `React` for its views. `React` is Facebook's new high performance view library that provides really clean and semantic language for defining how your views should be rendered and when/how they should update. You can read more about `React` [here](http://facebook.github.io/react/). `React` is a purely JavaScript based view layer. It uses a virtual DOM to compare the current DOM state to the new DOM state when updating so that it can submit only the minimal changes required to update the DOM. Changing the virtual DOM is very fast compared to updating the actual DOM thus this extra step amounts to a huge performance gain for `React`. Lastly, `React` is often written using [JSX](http://facebook.github.io/react/docs/displaying-data.html) syntax, which allows you to write pseudo-html in JavaScript.

```javascript
    var AwesomeView = React.createClass({
      render: function () {
        return (
          <h1>Hello World!</h1>
        );
      }
    });
```

***

## The Flux Architecture
`TuxedoJS` is built on Facebook's [Flux](https://facebook.github.io/flux/) architecture. The two key concepts of `Flux` are one-way data flow and the `Dispatcher`. With one way data flow, views and `stores` (in `Flux` models/collections are replaced with stores) do not communicate back and forth as in standard MVC applications. Instead, views communicate with stores through a Dispatcher. This Dispatcher can be thought of as a Controller in normal MVC applications. However, unlike in standard MVC architectures, there is only one Dispatcher.

The Dispatcher manages all the view and server events (in `Flux` these are called `actions`) and then dispatches those actions. Every store in a `Flux` application registers itself with the Dispatcher in order to listen to its dispatched actions and simply decides for itself which actions are relevant to it. Then, the stores that have updated emit update events to inform their views that they need to come and get the new data. This design dramatically simplifies data flow in an app and allows stores to fully encapsulate their data with as little coupling as possible. Normally, in a `Flux` application the Views will respond to user interaction by triggering `Action Helpers`, which usually will make Ajax requests or some other kind of asynchronous request and then dispatch the corresponding `Action` when the request completes.

![Flux Architecture Diagram](http://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png "Flux Architecture Diagram")

***

## Where Tuxx Fits In
`React` and `Flux` are both very powerful. They are even more powerful when used together since the two pieces fit together perfectly to provide all the functionality needed for an app. However, currently there is substantial glue code associated with getting `React` and `Flux` up and running and communicating with each other. More importantly, the standard `Flux` implementation relies on string comparisons and switch statements both of which are extremely fragile and can introduce difficult to track down bugs in a codebase. Lastly, although `Flux` decouples stores as much as possible, sometimes stores will still dependent on each other and managing those dependencies in `Flux` can be an absolute nightmare.

`TuxedoJS` solves these problems by wrapping `React` and `Flux` together into a single framework that abstracts away all of the boilerplate and complexity associated with getting a `Flux` application up and running and communicating with React. Additionally, `Tuxx` Provides powerful augmented `React` Classes that are designed to handle different aspects of the app frontend such as managing state and listening to events from stores. The `TuxedoJS` app architecture looks like the following:

![Tuxx Architecture Diagram](http://i.imgur.com/ouk3Oa8.png "Tuxx Architecture Diagram")

Let's dive in to what these different pieces actually represent.

***

### The Modular Framework Structure
In the below examples we are using the `require` syntax associated with `CommonJS` modules. Of note is the fact that we are never writing the line `require('tuxx');`. That's because there is no global object to require for TuxedoJS. Instead, `Tuxx` is broken up into individual modules that handle a particular aspect of your application. What's the advantage of this?

Firstly, it allows you to write semantic require statements that make it extremely clear what `Tuxx` modules you need for your individual app components.

Secondly, it means that, unlike with other popular frameworks, `Tuxx` never adds any more weight to your app than what you need for your purposes. For example, `TuxedoJS` comes prepackaged with beautiful animations. If you don't want to use them however, they never get loaded and thus never add any bytes to your JavaScript files. Even better, if you want to use just one or some `TuxedoJS` prebuilt animations, simply require those animations and use them, no other animations will get bundled. If you don't need `Tuxx` Architecture for an app, simply don't require it and it will never get loaded.

```javascript
    var Actions = require('tuxx/Actions');
    var Stores = require('tuxx/Stores');
    var React = require('tuxx/React');
    var Architecture = require('tuxx/Architecture');
    var Fly = require('tuxx/Animations/Fly');
    var FadeDownBig = require('tuxx/Animations/Fade/DownBig');
```

***

### TuxedoJS allows you to write out all of your inter-store relationships in one file using a simple and declarative syntax.
This turns the process of managing store relationships from frustrating and difficult to easy and self-documenting, allowing you and future engineers using your codebase to easily reason about your application architecture. `TuxedoJS` is the first framework we know of that allows you to write out your model dependencies in such a clean and simple syntax and we are extremely excited to use this syntax in building complex web apps.

```javascript
    //in our main.js or similar file

    var roomStore = require('./stores/roomStore');
    var userStore = require('./stores/userStore');
    var messageStore = require('./stores/messageStore');

    var architect = require('tuxx/Architecture').architect;

    architect(userStore).itOutputs('usernames');
    architect(roomStore).itNeeds('usernames').itOutputs('message rooms');
    architect(messageStore).itNeeds('message rooms');
```

***

### TuxedoJS abstracts away the Dispatcher and provides a vastly improved syntax for dispatching and listening to actions
This allows you to dispatch and listen for actions in a declarative, simple, and safe fashion. Additionally, unlike in `Flux` where it is necessary to use Action Helpers to manage async requests with actions, `TuxedoJS` provides a powerful and semantic `before` method syntax, allowing an action to decide for itself what callbacks need to be invoked before it can dispatch its action.

```javascript
    var Actions = require('tuxx/Actions');

    var roomActions = Actions.createActionCategory({
      category: 'rooms',
      source: 'room views',
      actions: ['get', 'add', 'remove']
    });

    //the dispatchGet input is the method that will actually dispatch our rooms/get action. Thus, here we are submitting an Ajax request and then dispatching the results of that request for our rooms/get action whenever roomActions.get method is invoked
    roomActions.before('get', function (dispatchGet) {
      ajaxRequest('/rooms', 'GET').then(function (results) {
        dispatchGet(results);
      });
    });

    module.exports = roomActions;
```

***

### TuxedoJS makes it easy to create stores and hook them up with your actions
`TuxedoJS` abstracts away all of the boilerplate associated with creating stores and makes it easy to connect stores with actions and views.

```javascript
    var Stores = require('tuxx/Stores');
    var roomActions = require('../actions/roomActions');

    var roomStore = Stores.createStore({
      _rooms = [],

      getAll: function () {
        return this._rooms;
      },

      onGetDispatch: function (roomsData) {
        this._rooms = roomsData;
        this.emitChange();
      }
    });

    roomActions.register(roomStore, {
      //registered callbacks are invoked with the context of the passed in store by default so we don't need to do any binding here
      get: roomStore.onGetDispatch
    });

    module.exports = roomStore;
```

***

### TuxedoJS provides powerful augmented `React` syntax which makes it extremely easy to connect your state managing views with your stores
`TuxedoJS` provides opinionated `React` classes with built in convenience methods for performing distinct operations in your app. The augmented class in the example below possesses tools for easily and semantically connecting with `Tuxx` Stores.

**NOTE** here that we are storing the result of `require('tuxx/React')` in a variable called `React` here. This is to take advantage of React's beautiful JSX syntax, which automatically converts JSX to `React.METHOD NAME`.

```javascript
    var React = require('tuxx/React');
    var roomStore = require('../stores/roomStore');
    var roomActions = require('../actions/roomActions');

    //for this example let's imagine we have created a Rooms and RoomCreateForm TuxxReact class
    var Rooms = require('./Rooms');
    var RoomCreateForm = require('./RoomCreateForm');

    var RoomViewOwner = React.createOwnerClass({
      getInitialState: function () {
        return {
          rooms: roomStore.getAll()
        };
      },

      //TuxxOwnerClasses have a connectOwnerToStore method that allows them to easily define the store they listening to the callback to invoke when the store data updates
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

      //TuxxOwnerClasses can automatically share static props and methods with any level of child component as long as there is not another OwnerClass between the two. In this case all children beneath the RoomViewOwner will automatically have access to the delete and edit methods under this.nearestOwnerProps
      registerOwnerProps: function () {
        return {
          delete: roomActions.delete,
          edit: roomActions.edit
        };
      },

      componentDidMount: function () {
        roomActions.get();
      },

      render: function () {
        return (
          <RoomCreateForm />
          <Rooms rooms={this.state.rooms} />
        );
      }
    });

    module.exports = RoomViewOwner;
```

`Tuxx` even provides a class designed to take advantage of the performance boosting tools in `React` for performance critical components in your application.

```javascript
    var React = require('tuxx/React');

    var Room = React.createMutableClass({
      propTypes: {
        room: React.PropTypes.object.isRequired
      },

      //just as with standard React props we can check to make sure we have the nearestOwnerProps we will need for our component
      nearestOwnerPropTypes: {
        delete: React.PropTypes.func.isRequired
      },

      //mutableTraits allows us to define the props and state that will be able to update in this class. We perform a one time deep search to find the props/state and, from then on, whenever the component is triggered to update it checks to see if the props or state have changed and, if they have not, then the class does not need to rerender in the virtual DOM
      mutableTraits: {
        props: 'name'
      },

      handleDelete: function (e) {
        e.preventDefault();

        //using the delete method we automatically get access to from our nearest owner
        this.nearestOwnerProps.delete(this.props.room);
      },

      render: function () {
        return (
          <div>
            <h2>{this.props.room.name}</h2>
            <button onClick={this.handleDelete}>Delete</button>
          </div>
        );
      }
    });
```

***

## Next Steps
Hopefully now you are a little excited about `TuxedoJS` and how you can use it in your apps. From here you can head to [getting started](./getting-started) to build a basic Todo app in `Tuxx`. Alternatively, take a look at our deployed [Tuxx Chat App](TuxedoJS.github.io/TuxxChatApp) and [Tuxx Todo App](TuxedoJS.github.io/TuxxTodoApp). Lastly, check out our [api documentation](./docs) to get a deep dive with `Tuxx`.
