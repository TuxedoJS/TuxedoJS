## Tuxx Getting Started Guide

## Table of Contents
<ol>
  <li><a href="#Getting-Started-with-TuxxTodoApp">Getting Started with TuxxTodoApp</a></li>
  <li><a href="#Tuxx-Environment-Setup">Tuxx Environment Setup</a>
  <li><a href="#TodoViewOwner">TodoViewOwner.jsx</a>
  <li><a href="#Todo">Todo.jsx</a>
  <li><a href="#TodoCreateForm">TodoCreateForm.jsx</a>
  <li><a href="#todoActions">todoActions.js</a>
  <li><a href="#todoStore">todoStore.js</a>
  <li><a href="#TuxxTodoApp-and-index">TuxxTodoApp.js and index.html</a>
  <li><a href="#Bundling-and-Serving">Bundling and Serving</a>
  <li><a href="#Conclusion">Conclusion</a>
</ol>

## <a id="Getting-Started-with-TuxxTodoApp"></a>Getting Started with TuxxTodoApp [#](#Getting-Started-with-TuxxTodoApp)
To get started hacking with `Tuxx`, let's see what some parts of a Todo component might look like inside a To-Do Application built with `Tuxx`.

## <a id="Tuxx-Environment-Setup"></a> Tuxx Environment Setup [#](#Tuxx-Environment-Setup)
Prior to getting started on the Todo application using `Tuxx` we need setup our working environment. `Tuxx` is built with CommonJS and thus you will need a compiler such as `Browserify` or `webpack`. In our case, we use `Browserify` for compiling, `Reactify` for compiling JSX, `Envify` for accessing NODE_ENV variables in the browser (great for automatically turning dev tools on and off), and `Watchify` for automatic compiling.

```
    npm install --save browserify
    npm install --save envify
    npm install --save reactify
    npm install --save watchify
```

To use these modules in development, we recommend adding the following lines to the `scripts` key of your `package.json` file to set up automatic JSX compiling and configure testing:

```json
    "scripts": {
      "start": "watchify -d TuxxTodoApp.js -o bundle.js -v",
      "build": "NODE_ENV=production browserify TuxxTudoApp.js | uglifyjs -cm > bundle.js"
    }
```

Include this `browserify` transform in your `package.json` file as well. This tells `browserify` to include the `reactify` transform (with `es6` enabled for things like `spread` syntax) and the `envify` transform.

```
    "browserify": {
      "transform": [
        [
          "reactify",
          {
            "es6": true
          }
        ],
        "envify"
      ]
    }
```

The `browserify` transform will cause `watchify` to use `reactify` to compile your JSX and `es6` syntax like the `Spread` syntax, and allow you to use `envify` for node environment variables in the browser.

After adding this code, run

    npm start

during development to automatically compile all JSX and JavaScript syntax into one `bundle.js` which you can then directly link to your `index.html` file. Use

    npm run build

to compile a production ready bundle of your code.

Here is the completed `package.json` file used for the `TuxxTodoApp`:

```json
    {
      "name": "TuxxTodoApp",
      "version": "0.0.1",
      "description": "Example TuxxTodoApp built using TuxedoJS",
      "main": "index.js",
      "scripts": {
          "start": "watchify -d TuxxTodoApp.js -o bundle.js -v",
          "build": "NODE_ENV=production browserify TuxxTodoApp.js | uglifyjs -cm > bundle.js"
      },
      "browserify": {
        "transform": [
          [
            "reactify",
            {
              "es6": true
            }
          ],
          "envify"
        ]
      },
      "repository": {
        "type": "git",
        "url": "https://github.com/TuxedoJS/TuxxTodoApp"
      },
      "keywords": [
        "Tuxx",
        "TuxxTodoApp"
      ],
      "author": "drabinowitz, cheerazar, plauer, sjstebbins",
      "license": "MIT",
      "bugs": {
        "url": "https://github.com/TuxedoJS/TuxxTodoApp/issues"
      },
      "homepage": "https://github.com/TuxedoJS/TuxxTodoApp",
      "dependencies": {
        "browserify": "^8.0.2",
        "envify": "^3.2.0",
        "reactify": "^0.17.1",
        "watchify": "^2.2.1"
      }
    }
```

## <a id="TodoViewOwner"></a>TodoViewOwner.jsx [#](#TodoViewOwner)
Let's start by creating the top level Todo component using `Tuxx's` `createOwnerClass`. The Owner class is responsible for the state of our Todo application. The `OwnerClass` possesses tools allowing it to automatically expose static methods and properties to its child components and listen to changes from stores. In this application we will use an `OwnerClass` to manage our todo components, trigger todo actions, and listen to todo store change events.

**NOTE** We are going to build out the `todoStore`, `todoActions`, and the `TodoCreateForm` later in the Getting Started Guide.

```javascript
    var React = require('tuxx/React');
    var todoActions = require('./todoActions');
    var todoStore = require('./todoStore');
    var Todo = require('./Todo.jsx');
    var TodoCreateForm = require('./TodoCreateForm.jsx');

    var TodoViewOwner = React.createOwnerClass({
      getInitialState: function () {
        return {
          todos: todoStore.getAll() // Will get all of the Todos that are stored in the TodoStore
        };
      },

      // This method connects this owner component to the specified store and is invoked with the context of the component. Additionally it also adds and removes the change listeners from the store during the appropriate lifecycle events, specifically componentDidMount and componentWillUnmount.
      connectOwnerToStore: function () {
        return {
          store: todoStore,
          listener: function () {
            this.setState({ todos: todoStore.getAll() });
          }.bind(this)
        };
      },

      // The registerOwnerProps method is invoked with the context of the component and allows an OwnerClass to automatically expose its properties to its child components (direct or otherwise). In this instance this component is exposing the add and remove methods specified in the return.
      registerOwnerProps: function () {
        //  These methods will dispatch the corresponding actions to any listening stores. Additionally, you can pass in an object and the store will receive it as an input to its callback.
        return {
          add: todoActions.add,
          remove: todoActions.remove
        };
      },

      render: function () {
        // Create an array of todo components
        var Todos = this.state.todos.map(function(todo) {
          return (
            <Todo todo={todo} />
          );
        });

        // Render all of the Todo components and the TodoCreateForm
        return (
          <div>
            <TodoCreateForm />
            {Todos}
          </div>
        );
      }
    });

    module.exports = TodoViewOwner;
```

## <a id="Todo"></a>Todo.jsx [#](#Todo)
`Tuxx` also provides the ability to build high performance components out of the box. In our Todo application within the individual Todo component, a Todo's text is a `mutableTraits` property, that means that we can check to see if this property has updated and then the component will re-render. If it hasn't, we can skip the re-render since we know the component hasn't updated.

```javascript
    var React = require('tuxx/React');

    var Todo = React.createMutableClass({
      // Here we are specifying that we want to watch a `text` property in our `props` for changes. We will perform a one-time deep search to find `text`.
      mutableTraits: {
        props: 'text'
      },

      propTypes: {
        todo: React.PropTypes.object.isRequired
      },

      // nearestOwnerPropTypes allows us to perform prop validation on our nearestOwnerProps
      nearestOwnerPropTypes: {
        remove: React.PropTypes.func.isRequired
      },

      handleRemove: function (e) {
        e.preventDefault();
        this.nearestOwnerProps.remove(this.props.todo); // Here we are using the `remove` method that our `TodoViewOwner` registered. The methods are exposed under `nearestOwnerProps`.
      },

      render: function () {
        return (
          <div>
            <p>{ this.props.todo.text }</p>
            <button onClick={this.handleRemove}>Delete</button>
          </div>
        );
      }
    });

    module.exports = Todo;

```

## <a id="TodoCreateForm"></a>TodoCreateForm.jsx [#](TodoCreateForm)
The `OwneeClass` is another form of opinionated `Tuxx` component. They receive their dynamic props through standard `this.props` sharing. They receive their static methods and props from their closest Owner component. The `TodoCreateForm` utilizes this by accessing the `add` method from its nearest owner component, which is the `TodoViewOwner`.

```javascript
    var React = require('tuxx/React');

    var TodoCreateForm = React.createOwneeClass({
      // nearestOwnerPropTypes allows us to perform prop validation on our nearestOwnerProps
      nearestOwnerPropTypes: {
        add: React.PropTypes.func.isRequired
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var todoTextInput = this.refs.textInput.getDOMNode();

        // Again here we are using the `add` method that has automatically been shared with us by the `TodoViewOwner` on `nearestOwnerProps`.
        this.nearestOwnerProps.add({
          text: todoTextInput.value
        });

        todoTextInput.value = '';
      },

      render: function () {
        return (
          <form onSubmit={this.handleSubmit}>
            <input type="text" ref="textInput" placeholder="Add a Todo" />
            <button type="submit">Add</button>
          </form>
        );
      }
    });

    module.exports = TodoCreateForm;
```

## <a id="todoActions"></a>todoActions.js [#](#todoActions)
`Tuxx` leverages the `Flux` architecture but abstracts away all of the normal boilerplate associated with `Flux`. In `Tuxx` we build `actionCategories` and then we can invoke them in order to dispatch their actions and register with them in order to receive these actions. Here is the `todoActions` category that we required in from before.

```javascript
    var Actions = require('tuxx/Actions');

    var todoActions = Actions.createActionCategory({
      category: 'todos',
      source: 'todo views',
      actions: ['add', 'remove'] // the specified actions will become methods on the todoActions ActionCategory. These actions allow us to get data from our views to our actions and then to our stores
    });

    module.exports = todoActions;
```

## <a id="todoStore"></a>todoStore.js [#](#todoStore)
`Tuxx` provides all of the glue code needed to build stores and register them with the `TuxxActions` dispatcher. Now that we have created our actions and views. Let's create our store for our Todos that respond to our actions and provide the data for our views. `Tuxx` here again significantly reduces the boilerplate required to get a store up and running.

```javascript
    // We require the todoActions to make sure the actions have been created before we attempt to register with them.
    var todoActions = require('./todoActions');
    var ActionStores = require('tuxx/Stores/ActionStores');

    var todoStore = ActionStores.createStore({
      _todos: [],

      getAll: function () {
        return this._todos;
      },

      onAdd: function (todo) {
        this._todos.push({
          text: todo.text,
          id: this._todos.length
        });
        this.emitChange();
      },

      onRemove: function (todo) {
        this._todos.splice(todo.id, 1);
        this.emitChange();
      },

      // Here we are using the `register` method to register listeners for the `todoStore` for the `add` and `remove` verbs. When those action verbs occur they will invoke the methods associated with them.
      register: function () {
        return {
          todos: {
            add: this.onAdd,
            remove: this.onRemove
          }
        };
      }
    });

    module.exports = todoStore;
```

## <a id="TuxxTodoApp-and-index"></a>TuxxTodoApp.js and index.html [#](#TuxxTodoApp-and-index)
Finally after putting together all of the pieces, let's render the `TodoViewOwner` component to the DOM.

```javascript
    var React = require('tuxx/React');
    var TodoViewOwner = require('./TodoViewOwner.jsx');

    // Render the TodoViewOwner component to the element with the id 'main'
    React.render(<TodoViewOwner />, document.getElementById('main'));
```

Below is our `index.html` file. The `<div id="main"></div>` will be where our `TodoViewOwner` is rendered and the `<script src="bundle.js"></script>` will refer to the output of `browserify`.

```markup
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>TuxxTodoApp</title>
    </head>
    <body>
      <div id="main"></div>
      <script src="bundle.js"></script>
    </body>
```

## <a id=Bundling-and-Serving></a>Bundling and Serving [#](#Bundling-and-Serving)
Once we have all of these pieces we can run the `npm start` command to get our JavaScript to bundle together. Following that we can either start a simple HTTP server or we can open the `index.html` page in our browser of choice. Now you should be able to add and delete Todos from your basic `TuxxTodoApp`!

## <a id="Conclusion"></a>Conclusion [#](#Conclusion)
This example should illustrate the versatility and semantic nature of `Tuxx`. Each of the opinionated components provides powerful convenience methods that allow you to do a multitude of operations. For one you have the ability to share properties and methods between components without using the standard `React` pass down syntax. You have the ability to harness the performance benefits of the Mutable class components. Then there is the ease in which you can declare your `Flux` actions, create your stores with reduced boilerplate, and register your stores with your Actions.

For more documentation and examples in `Tuxx` check out the following resources:

1. Check out the full `TuxedoJS` documentation on either its [website](http://tuxedojs.org/docs) or the [GitHub](https://www.github.com/TuxedoJS/TuxedoJS/tree/master/docs).
1. You can see the complete built out Todo application in the [TuxedoJS GitHub Organization](https://github.com/TuxedoJS/TuxxTodoApp).
1. The TuxxChatApp can be found [here](https://www.github.com/TuxedoJS/TuxxChatApp). **NOTE** The master branch is built using `Tuxx`, while the React-Flux branch is built using standard `React` and `Flux`.
