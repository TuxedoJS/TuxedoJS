# Tuxx/React

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#React-Components-in-a-Nutshell">React Components in a Nutshell</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Writing-React-and-tuxxReact-in-JSX">Writing React and tuxxReact in JSX</a></li>
      <li><a href="#Rendering-in-React">Rendering in React</a></li>
      <li><a href="#React-Components">React Components</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#React-Components-the-Render-Method">The Render Method</a></li>
          <li><a href="#React-Components-Accessing-the-DOM-from-React">Accessing the DOM from React</a></li>
          <li><a href="#React-Components-Props-and-State">Props and State</a>
            <ol>
              <li><a href="#React-Components-props-children">props.children</a></li>
              <li><a href="#React-Components-PropTypes">PropTypes</a></li>
            </ol>
          </li>
          <li><a href="#React-Components-Lifecycle-Methods">Lifecycle Methods</a></li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#TuxedoJS-and-React">TuxedoJS and React</a>
    <ol>
      <li><a href="#TuxedoJS-OwnerClass">TuxedoJS OwnerClass</a></li>
      <li><a href="#TuxedoJS-OwneeClass">TuxedoJS OwneeClass</a></li>
      <li><a href="#TuxedoJS-MutableClass">TuxedoJS MutableClass</a></li>
    </ol>
  </li>
  <li><a href="#TuxedoJS-Conclusion">TuxedoJS Conclusion</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>`React` is an extremely powerful and complex view library. `TuxedoJS` builds on its functionality in order to make it more semantic and easier to work with for developers.

***

### <a id="React-Components-in-a-Nutshell"></a>React Components in a Nutshell [#](#React-Components-in-a-Nutshell)
React is a view library designed for extremely high performance rendering. The core concept in `React` is the Virtual DOM. When `React` components update they create a virtual version of the new DOM. Then, `React` diffs the new virtual DOM with the old copy and submits only those changes between the two in order to update the real DOM. `React` is a complicated library and we recommend reviewing the full docs [here](http://facebook.github.io/react/). However, we figured it would be valuable to provide a quick primer on `React` to give an introductory understanding.

***

#### <a id="Writing-React-and-tuxxReact-in-JSX"></a>1) Writing React and tuxx/React in JSX [#](#Writing-React-and-tuxxReact-in-JSX)
`React` can be written in beautiful [JSX](http://facebook.github.io/react/docs/displaying-data.html) which allows you to write React components as though they were HTML tags. We love JSX here at `TuxedoJS` and we strongly recommend using it. Our components are written using JSX but you do not need to write JSX with `Tuxx`. The examples for `Tuxx` in our docs will be written in JSX syntax.

One extremely important note, if you want to use JSX with Tuxx (and you really should) you will need to call your `tuxx/React` variable `React`:

```javascript
    var React = require('tuxx/React');
```

Why do we need to do this? Because JSX translates into `React.METHOD NAME` automatically, thus we need to call our variable `React` for our methods to work after compiling our JSX.

In the following examples we will be writing in basic `React` syntax.

***

#### <a id="Rendering-in-React"></a>2) Rendering in React [#](#Rendering-in-React)
The most common way to render a component in `React` is with the `React.render` method:

```javascript
    var React = require('react');
    var MyComponent = require('./components/MyComponent'); //Some component we want to render
    //This will render our custom component into document.body
    React.render(<MyComponent />, document.body); //Using JSX for MyComponent
```

Oftentimes, if you are using the `tuxx/Router`, you will only need to invoke this method once to render the top level `tuxx/Router/run` onto the DOM. This component will define your client-side application routes which will automatically render their child components when the corresponding route is reached:

```javascript
    var React = require('tuxx/React');
    var routes = require('./routes'); //your application routes
    var run = require('tuxx/Router/run');

    run(routes, function (Handler) {
      React.render(<Handler />, document.body); //Again using JSX for Handler
    });
```

At that point everything else will be rendered into the DOM through the `render` methods within your individual components. Let's dive into these `React` components.

***

#### <a id="React-Components"></a>3) React Components [#](#React-Components)
`React` components are defined via the `React.createClass` method. Pass in an object to this method, and `React` will return a class which you can then use to render components built from that class into the DOM:

```javascript
    var React = require('react');
    var MyComponent = React.createClass({
      render: function () {
        return (
          <h1>Hello World!</h1>
        );
      }
    });
```

***

#### <a id="React-Components-the-Render-Method"></a>3.1) The Render Method [#](#React-Components-the-Render-Method)
All `React` classes must have a `render` method. The `render` method must return a single `React` component (either a basic `React` HTML component for rendering onto the DOM (`h1`, `div`, `p`, etc) or a `React` composite class (any custom build `React` component, for example `MyComponent` defined above is a `React` composite class). The `render` method must return a valid HTML component, which means that it must be closed. eg `<input placeholder="things" />`

It might seem like returning only a single `React` component is a bit limiting. However, you can pass in child components to whatever `React` component you render. We will get more into what that actually means in the next section, but in layman's terms it means you can `render` however many components you want:

```javascript
    var React = require('react');
    var ComponentA = require('./ComponentA');
    var ComponentB = require('./ComponentB');
    var thisComponentIsAwesome = true;

    var MyComplicatedComponent = React.createClass({
      var someArrayOfComponents = [<ComponentA key={0} />, <ComponentB key={1} />];
      render: function () {
        return (
          <div>
            <MyComponent className='custom-class-name' />
            <h1>Let's render something { thisComponentIsAwesome ? 'Awesome' : 'Lame' }</h1>
            { someArrayOfComponents }
          </div>
        );
      }
    });
```

**NOTES**
1. We are wrapping `someArrayOfComponents` and our ternary expression in `{}`. That's because, in order to use JavaScript variables and expressions in our JSX we need to wrap them in `{}` and we need to use ternary expressions if we want to write if else statements in our JSX. You can learn more about if-else in JSX [here](http://facebook.github.io/react/tips/if-else-in-JSX.html).
2. We are passing in `key` properties to our components in our array. Whenever we render an array of components we need to pass in a unique key to each one, which `React` will use to determine which components in the array have been modified and which have been deleted/added when the array updates. You can't access the `key` property from within the component itself.
2. There are several restrictions regarding what JavaScript we can write in our JSX and you can read more about that [here](http://facebook.github.io/react/docs/jsx-in-depth.html#javascript-expressions).
3. We are passing in a property `className`. This, is because `class` is a reserved word in JavaScript. See [here](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components) for some other differences between JSX and HTML.
4. See [here](http://facebook.github.io/react/docs/jsx-gotchas.html) for all other JSX gotchas.

***

#### <a id="React-Components-Accessing-the-DOM-from-React"></a>3.2) Accessing the DOM from React [#](#React-Components-Accessing-the-DOM-from-React)
`React` provides the `getDOMNode` method for accessing the actual DOM node for a particular component. This can be valuable for interacting with other libraries such as `jQuery` or reading from inputs. Normally, to use `getDOMNode` you will need to pass in a `ref` property to the component. The `ref` property allows the owning component to access the component via `this.refs.REF`. **NOTE** you cannot access the `ref` property from within the ownee component itself.

```javascript
    var InputForm = React.createClass({
      addTodo: function () {/*...*/},

      handleSubmit: function (e) {
        e.preventDefault(),
        this.addTodo(this.refs.inputField.getDOMNode().value);
      },

      render: function () {
        <form onSubmit={this.handleSubmit}>
          <input ref='inputField' />
        </form>
      }
    });
```

**NOTE** here that we can access the `form` `submit` event by passing in a function under the `onSubmit` property. This is how we hook into any `DOM` event: `onEventName`.

***

#### <a id="React-Components-Props-and-State"></a>3.3) Props and State [#](#React-Components-Props-and-State)
In `React` components have two ways of defining changing data, `props` and `state`. Component `props` are passed down from parent components and are never updated by the component itself (under almost all circumstances). `state` is managed within the component itself and used for things like getting data from models and stores or third party APIs. It is also used for [two-way data binding in form/input validation](http://facebook.github.io/react/docs/two-way-binding-helpers.html). You never modify the `state` object directly but instead use methods like `this.setState` and `this.replaceState` to update the `state` in the component.

Other than in the case of input validation `React` follows a one-way data flow in which very few top level components have `state` and they pass down `props` based on that state to their child components. Those components pass down `props` to their children and so on and so forth. There is a great doc [here](http://facebook.github.io/react/docs/thinking-in-react.html) about how to think in `React` and this one-way flow of data. Component `props` should be things like application data, but they should also be the methods to manipulate that data. For example, if you want your `Todo` components to be able to delete themselves, they should have their delete method passed in via `props`. Why is this? Because it allows your components to be as reusable as possible. Additionally, it reduces the number of components that have to know about your actions, Ajax-requests, etc. Here is what this might look like in an example `state` managing top level component

```javascript
    var React = require('react');
    var Todos = require('./Todos'); //some list of messages component

    var MyTopLevelComponent = React.createClass({
      //whenever a component has state it needs a getInitialState method which returns the initial state object for the component
      getInitialState: function () {
        return {
          todos: []
        };
      },

      addTodo: function (todo) {
        //we can never modify the state object directly, so to add our new todo we setState with our current todos concatenated with our new todo
        this.setState({
          todos: this.state.todos.concat(todo)
        });
      },

      render: function () {
        return (
          <div>
            //here we are using JSX syntax to pass a todos prop and addTodo prop into our Todos component
            <Todos todos={this.state.todos} addTodo={this.addTodo} />
          </div>
        );
      }
    });
```

**NOTES**
1. We are setting an initial `state` to an empty array of `todos`.
2. We are defining our method for adding `todos` on our top level component and then passing that method in as `props` to our `Todos` component.
3. With `JSX` we can pass in props in much the same way we pass in properties to HTML elements.
4. You might be thinking: 'wait but what if we need to pass addTodo down into a component that is nested many levels down from our top level component, wouldn't that be really annoying? The answer is: you are correct it is very annoying with `React`. `React` provides a `Spread` syntax to make cascading down `props` a little easier, but even still it is tough. Don't worry however, `Tuxx` makes this a lot easier on us.

***

##### <a id="React-Components-props-children"></a>3.3.1) props.children [#](#React-Components-props-children)
When you pass in children to a `React` component you are actually just passing in `props` to the component through an altered syntax. When you pass in children to a component, that component will have access to them through the opaque data structure `this.props.children`.

**NOTE** This means that passing in children to a component does not mean that those children will be rendered. It's up to the component to decide what to do with its children. For the base `React` components children will be rendered as is however. You can read more about children and ownership in `React` [here](http://facebook.github.io/react/docs/multiple-components.html).

The `this.props.children` data structure is opaque so you should use `React` specialized methods for accessing `children`. Those methods are described in full [here](http://facebook.github.io/react/docs/top-level-api.html#react.children)

```javascript
    var Parent = React.createClass({
      render: function () {
        <div>
          { this.props.children }
        </div>
      }
    });
```

***

##### <a id="React-Components-PropTypes"></a>3.3.2) PropTypes [#](#React-Components-PropTypes)
Passing `props` down into components is a somewhat passive framework design. To combat this, components can define the `propTypes` they need or expect:

```javascript
    Var MyComponent = React.createClass({
      propTypes: {
        optionalObjectProp: React.PropTypes.object,
        requiredFunctionProp: React.PropTypes.func.isRequired
      }
    });
```

There is a huge laundry list `propTypes` specifications you can provide. Review them [here](http://facebook.github.io/react/docs/reusable-components.html#prop-validation).

***

#### <a id="React-Components-Lifecycle-Methods"></a>3.4) Lifecycle Methods [#](#React-Components-PropTypes)
The main way to hook into `React` components is through lifecycle methods which are triggered at different significant events for the component. Lifecycle events are triggered in a batched depth first manner. This is easiest to show with an example:

```javascript
    var MyLifeCycleComponent = React.createClass({
      componentWillMount: function () {
        //I am called once and first, the first time the component is going to render in the virtual DOM
        //if setState is invoked in me then it will not trigger a re-render but the upcoming render will see the new state
      },

      componentDidMount: function () {
        //I am called once after the initial render, you can access the DOM representation of the component for the first time with this.getDOMNode() in me
      },

      componentWillReceiveProps: function (newProps) {
        //I am called every time the component is receiving properties after the initial render
        //I have access to the upcoming props through the newProps input
        //if setState is invoked in me then it will not trigger a re-render but the upcoming render will see the new state
      },

      shouldComponentUpdate: function (nextProps, nextState) {
        //I am called every time the component might update after componentWillReceiveProps
        //I have access to the upcoming props and state with nextProps and nextState
        //if I return true the componentWillUpdate lifecycle will happen, if I return false the the rest of the rendering and lifecycle methods will be canceled
      },

      componentWillUpdate: function (nextProps, nextState) {
        //I am called every time the component will update after shouldComponentUpdate
        //I have access to the upcoming props and state with nextProps and nextState
        //you cannot under any circumstances call setState or replaceState in me
      },

      render: function () {
        //I am where the actual rendering happens
        return (
          <div />
        );
      },

      componentDidUpdate: function () {
        //I am the final lifecycle method to be called after an update
        //I am called after the render method
      },

      componentWillUnmount: function () {
        //I am the final lifecycle method and I am called once before the component is removed
      }
    });
```

The only other thing to know about lifecycle methods is their order between components. Lifecycle methods are triggered in a depth first top-down fashion for all `pre-render/render` methods. Then, after all `render` methods have completed, all of the post `render` methods are triggered in reverse depth first top-down order where the deepest top-most component has its post `render` method triggered, then all other children of its parent component, then its parent, etc. Let's take a look at an example.

This structure:

```javascript
    <Root>
      <Branch1>
        <Leaf1 />
      </Branch1>
      <Branch2>
        <Leaf2 />
      </Branch2>
    </Root>
```

Would lead to the following event triggers:

```javascript
    Root WILL MOUNT
    Root RENDER
    Branch1 WILL MOUNT
    Branch1 RENDER
    Leaf1 WILL MOUNT
    Leaf1 RENDER
    Branch2 WILL MOUNT
    Branch2 RENDER
    Leaf2 WILL MOUNT
    Leaf2 RENDER
    Leaf1 DID MOUNT
    Branch1 DID MOUNT
    Leaf2 DID MOUNT
    Branch2 DID MOUNT
    Root DID MOUNT
```

This same order would be applied for all update methods. The `componentWillUnmount` lifecycle will happen in the same order as `componentWillMount`.

***

### <a id="React-Conclusion"></a>4) React Conclusion [#](#React-Conclusion)
Hopefully this primer has given a brief introduction to `React` and has given enough to get you excited to learn more and helped to provide a picture of some of `React's` strengths and weaknesses. There is a ton to `React` and you should investigate Facebook's docs to learn more. Next, we will be jumping in to where `TuxedoJS` comes into play in this.

***

### <a id="TuxedoJS-and-React"></a>5) TuxedoJS and React [#](#TuxedoJS-and-React)
So where does `Tuxx` come in with all of this? `TuxedoJS` provides three powerful opinionated `React` components that improve and extend `React` functionality.

***

#### <a id="TuxedoJS-OwnerClass"></a>5.1) TuxedoJS OwnerClass [#](#TuxedoJS-OwnerClass)
`TuxedoJS` provides a component class actually designed around the storage and management of `state` within an app called the `OwnerClass`:

```javascript
    var React = require('tuxx/React');
    var Todos = require('./Todos');

    var TodoOwner = React.createOwnerClass({
      getInitialState: function () {
        return {
          todos: []
        };
      },

      addTodo: function (todo) {
        this.setState({
          todos: this.state.todos.concat(todo)
        });
      },

      registerOwnerProps: function () {
        return {
          this.addTodo.bind(this)
        };
      },

      render: function () {
        return (
          <div>
            <Todos todos={this.state.todos} />
          </div>
        );
      }
    });
```

This class has the power to automatically share its static properties and methods with its children, which means no more cascading down methods through layers of components. This class also has methods for easily and semantically connecting with `TuxxStores`. You can read more about it [here](tuxedojs.org/docs/TuxxReact/TuxxOwnerClass).

***

#### <a id="TuxedoJS-OwneeClass"></a>5.2) TuxedoJS OwneeClass [#](#TuxedoJS-OwneeClass)
`Tuxx` provides an `OwneeClass` that is able to take advantage of its parent's `OwnerProps` to access these shared methods. All `Tuxx` classes are built off of the `OwneeClass`, which means that all `Tuxx` classes have access to these tools (including `OwnerClass` components):

```javascript
    var React = require('tuxx/React');
    var Todo = require('./Todo');

    var Todos = React.createOwneeClass({
      propTypes: {
        todos: React.PropTypes.array.isRequired
      },

      //Tux components can specify needed ownerProps just as they can with standard React props
      nearestOwnerPropTypes: {
        addTodo: React.PropTypes.func.isRequired
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var todoText = this.refs.todoText.getDOMNode();

        this.nearestOwnerProps.addTodo({
          text: todoText.value
        });

        todoText.value = '';
      },

      render: function () {
        var TodoArray = this.props.todos.map(function (todo) {
          return <Todo todo={todo} />
        });

        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input ref="todoText" />
            </form>
            { TodoArray }
          </div>
        );
      }
    });
```

The `OwneeClass` can automatically access the properties and methods exposed to it by its nearest `OwnerClass` through the `nearestOwnerProps` key. You can read more about it [here](tuxedojs.org/docs/TuxxReact/TuxxOwneeClass).

***

#### <a id="TuxedoJS-MutableClass"></a>5.3) TuxedoJS MutableClass [#](#TuxedoJS-MutableClass)
`Tuxx` provides a `MutableClass` designed to take advantage of the performance boosting tools in `React`. Like the other `Tuxx` classes it is also built off of the `OwneeClass`:

```javascript
    var React = require('tuxx/React');

    var Todo = React.createMutableClass({
      propTypes: {
        todo: React.PropTypes.object.isRequired
      },

      //the MutableClass defines a set of mutableTraits which allow it to determine when it actually needs to be updated in the virtual DOM
      mutableTraits: {
        props: 'text'
      },

      render: function () {
        return (
          <div>
            <h1>{ this.props.todo.text }</h1>
          </div>
        );
      }
    });
```

The `MutableClass` will find the passed in `mutableTraits` keys within `props` and `state`. In this case, it will find the `props.todo.text` property. When the component reaches the `shouldComponentUpdate` lifecycle event it will check the old copy of this property versus the new copy to determine if it should update automatically. You can read more about it [here](tuxedojs.org/docs/TuxxReact/TuxxMutableClass).

***

### <a id="TuxedoJS-Conclusion"></a>6) TuxedoJS Conclusion [#](#TuxedoJS-Conclusion)
`TuxedoJS` builds on the awesome `React` view layer by making it easier and more fun to work with. It provides opinionated classes and tools to easily describe and build out the different aspects of an application.
