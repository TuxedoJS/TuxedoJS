![Tuxx Logo](https://raw.githubusercontent.com/TuxedoJS/TuxedoJS/master/Tuxx-full-logo.png "Tuxx-Logo") <br />
[![Build Status](https://semaphoreapp.com/api/v1/projects/12b19e4d-b5d5-4e16-8614-b08f651e51c5/323763/badge.png)](https://semaphoreapp.com/cheerazar/tuxedojs)

> A Front-End JavaScript Framework built on Facebook&#39;s powerful React view layer and Flux architecture.

[React](https://github.com/facebook/react) and [Flux](https://github.com/facebook/flux) are two novel and exciting approaches to front-end development. Lots of people use `React` as the V in MVC, since it makes no assumptions about the rest of your technology stack and it uses a *virtual DOM* diff implementation for ultra-high performance.

`Flux` is an application architecture for `React` that remedies the problems associated with predicting changes in applications that use two-way directional data flows, instead utilizing a *unidirectional data flow* which makes it easier to understand and modify an application as it becomes more complicated. In `Flux`, the `Dispatcher` is a singleton that directs the flow of data and ensures that updates do not cascade. As an application grows, the `Dispatcher` becomes more vital, as it can also manage dependencies between stores by invoking the registered callbacks in a specific order. See this blog for more on [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html).

`TuxedoJS` capitalizes on the performance benefits of `React` and the simplified application architecture of `Flux`. It abstracts away unnecessary complexity and implements a more accessible and semantic interface for working with `Flux` and augmented `React` components in various aspects of the view logic.

## Table of Contents
<ol>
  <li><a href="#Features-and-Examples">Features and Examples</a></li>
  <li><a href="#Graceful-Degradation">Graceful Degradation</a></li>
  <li><a href="#Requirements">Requirements</a></li>
  <li><a href="#Development">Development</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Installing-TuxedoJS">Installing TuxedoJS</a></li>
      <li><a href="#Tasks-and-Dependencies">Tasks and Dependencies</a></li>
      <li><a href="#Roadmap">Roadmap</a></li>
    </ol>
  </li>
  <li><a href="#Credits-and-Tech-Stack">Credits and Tech Stack</a></li>
  <li><a href="#Interested-in-Contributing">Interested in Contributing?</a></li>
  <li><a href="#Team">Team</a></li>
</ol>

## <a id="Features-and-Examples"></a>Features and Examples [#](#Features-and-Examples)

`Tuxx` abstracts away the complexity of `Flux` with powerful `Actions` syntax:

```javascript
    var Actions = require('tuxx/Actions');

    var todoActions = Actions.createActionCategory({
      category: 'todos',
      source: 'todo views',
      actions: ['add', 'remove']
    });

    module.exports = todoActions;
```

`Tuxx` provides all of the glue code needed to build stores and register them with the `TuxxActions` dispatcher:

```javascript
    var TodoActions = require('./TodoActions')
    var ActionStores = require('tuxx/Stores/ActionStores');

    var todoStore = ActionStores.createStore({
      _todos: [],

      getAll: function () {
        return this._todos;
      },

      onAdd: function (todo) {/*handle creation of Todo*/},

      onRemove: function (todo) {/*handle removal of Todo*/},

      //semantic method allows us to register our store with actions
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

`Tuxx` provides powerful opinionated `React` classes that make connecting with your stores, sharing methods with child components, and building high performance components a synch.

A high performance component:

```javascript
    var React = require('tuxx/React');

    var Todo = React.createMutableClass({
      mutableTraits: {
        props: 'text'
      },

      //tuxx provides tools for automatically sharing static properties and methods between components via nearestOwnerProps
      handleRemove: function (e) {
        e.preventDefault();
        this.nearestOwnerProps.remove(this.props.todo);
      },

      render: function () {
        return (
          <p>{ this.props.todo.text }</p>
          <button onClick={this.handleRemove}>Delete</button>
        );
      }
    });

    module.exports = Todo;
```

A standard `Tuxx` component:

```javascript
    var TodoCreateForm = React.createOwneeClass({
      //you can perform propType checking on nearestOwnerProps too
      nearestOwnerPropTypes: {
        add: React.PropTypes.func.isRequired
      },

      //again, using automatically shared static methods here via 'nearestOwnerProps'
      handleSubmit: function (e) {
        e.preventDefault();
        var todoTextInput = this.refs.textInput.getDOMNode();
        this.nearestOwnerProps.add({text: todoTextInput.value});
      },

      render: function(){
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

A `Tuxx` class designed to manage state and pass down properties/methods:

```javascript
    var todoStore = require('./todoStore');
    var todoActions = require('./todoActions');
    var Todo = require('./Todo');
    var TodoCreateForm = require('./TodoCreateForm');

    var TodoViewOwner = React.createOwnerClass({
      getInitialState: function () {/*get Todos from store*/},

      connectOwnerToStore: function () {
        return {
          store: todoStore,
          listener: function () {
            this.setState({ todos: todoStore.getAll() });
          }
        };
      },

      registerOwnerProps: function () {
        return {
          add: todoActions.add,
          remove: todoActions.remove
        };
      },

      render: function () {
        var Todos = this.state.todos.map(function(todo) {
          return (<Todo todo={todo} />);
        });

        return (
          <div>
            <TodoCreateForm />
            {Todos}
          </div>
        );
      }
    });
```

`Tuxx` provides an entire library of semantic plug-and-play animations.

```javascript
    var React = require('tuxx/React');
    var Fly = require('tuxx/Animations/Fly');
    var FadeUp = require('tuxx/Animations/Fade/Up');

    var Home = React.createClass({
      render: function () {
        return (
          <div>
            <FadeDown>
              <h1>Hello World</h1>
            </FadeDown>
            <Fly>
              <h3>Hello, Classier World</h3>
            </Fly>
          </div>
        );
      }
    });
```

See our [TuxedoJS Doc Site](https://tuxedojs.org) for a full list of `Tuxx` features and functionality.

***

## <a id="Graceful-Degradation"></a>Graceful Degradation [#](#Graceful-Degradation)

> Tuxx allows you to be as classy as you want.

An integral facet of the `Tuxx` architecture is that you can use as much or as little of it as you want. `Tuxx` does absolutely no modifying of the underlying `React` and `Flux` components it is built upon, but rather extends their core functionality and provides more intuitive interfaces for leveraging their power.

Furthermore, `Tuxx` was designed to be as modular as possible, allowing you to only use the specific parts you need. It is for this very reason that we don't pollute the global namespace with one large `Tuxx` object that holds unncessary JavaScript.

Thus, feel free to fall back to `React` or `Flux` conventions as much or as little as you desire. We hope you enjoy the flexibility.

***

## <a id="Requirements"></a>Requirements [#](#Requirements)

- Node 0.10.x

***

## <a id="Development"></a>Development [#](#Development)

### <a id="Installing-TuxedoJS"></a>Installing TuxedoJS [#](#Installing-TuxedoJS)

Install `TuxedoJS` through npm:

    npm install tuxx

***

### <a id="Tasks-and-Dependencies"></a>Tasks and Dependencies [#](#Tasks-and-Dependencies)

Tuxx is built with CommonJS and thus you will need a compiler such as `Browserify` or `webpack`. In our case, we use `Browserify` for compiling, `Reactify` for compiling JSX, `Envify` for accessing NODE_ENV variables in the browser (great for automatically turning dev tools on and off), and `Watchify` for automatic compiling.

    npm install --save browserify
    npm install --save envify
    npm install --save reactify
    npm install --save watchify

To use these modules in development, we recommend adding the following lines to the `scripts` key of your `package.json` file to set up automatic JSX compiling and configure testing:

    "scripts": {
      "start": "watchify -d [YOUR MAIN.JS OR SIMILAR FILE] -o [YOUR OUTPUT BUNDLE.JS] -v",
      "build": "NODE_ENV=production browserify [YOUR MAIN.JS OR SIMILAR FILE] | uglifyjs -cm > [YOUR OUTPUT BUNDLE.JS]"
    }

Include this `browserify` transform in your `package.json` file as well:

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

The `browserify` transform will cause `watchify` to use `reactify` to compile your JSX and `es6` syntax like the `Spread` syntax, and allow you to use `envify` for node environment variables in the browser.

After adding this code, run

    npm start

during development to automatically compile all JSX and JavaScript syntax into one `bundle.js` which you can then directly link to your `index.html` file. Use

    npm run build

to compile a production ready bundle of your code.

***

### <a id="Roadmap"></a>Roadmap [#](#Roadmap)

View the project roadmap [here](https://github.com/TuxedoJS/TuxedoJS/issues).

***

## <a id="Credits-and-Tech-Stack"></a>Credits and Tech Stack [#](#Credits-and-Tech-Stack)

- [React](https://github.com/facebook/react)
- [React-Tools](https://www.npmjs.com/package/react-tools)
- [React-Router](https://github.com/rackt/react-router)
- [Flux](https://github.com/facebook/flux)
- [Jest](https://github.com/facebook/jest)
- [Jest-cli](https://www.npmjs.com/package/jest-cli)
- [CommonJS](https://github.com/commonjs/commonjs)
- [Browserify](http://browserify.org)
- [Reactify](https://github.com/andreypopp/reactify)
- [Watchify](https://github.com/substack/watchify)
- [Envify](https://github.com/hughsk/envify)
- [object-assign](https://github.com/sindresorhus/object-assign)

***

## <a id="Interested-in-Contributing"></a>Interested in Contributing? [#](#Interested-in-Contributing)

Please review [CONTRIBUTING.md](CONTRIBUTING.md).

***

## <a id="Team"></a>Team [#](#Team)

  - __Team Lead__: [Dmitri Rabinowitz](https://github.com/drabinowitz)
  - __Scrum Master__: [Gunnari Auvinen](https://github.com/Cheerazar)
  - __Product Owner__: [Spencer Stebbins](https://github.com/sjstebbins)
  - __Software Engineer__: [Pat Lauer](https://github.com/plauer)
