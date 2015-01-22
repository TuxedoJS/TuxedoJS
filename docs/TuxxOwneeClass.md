# Tuxx/React.OwneeClass

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Requiring-OwneeClass">Requiring OwneeClass</a></li>
      <li><a href="#Creating-an-OwneeClass-Component">Creating an OwneeClass Component</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Creating-an-OwneeClass-Component-Example">Creating an OwneeClass Component Example</a></li>
          <li><a href="#React-createOwneeClass">METHOD: React.createOwneeClass</a></li>
          <li><a href="#createOwneeClass-owneeClassProps">OBJECT: owneeClassProps</a>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#owneeClassProps-nearestOwnerPropTypes">OBJECT: owneeClassProps.nearestOwnerPropTypes</a></li>
              <li><a href="#owneeClassProps-anyPropTypes">OBJECT: owneeClassProps.anyPropTypes</a></li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </li>
  <li><a href="#TuxxOwneeClass-Guidelines">TuxxOwneeClass Guidelines</a>
  <li><a href="#TuxxOwneeClass-Complete-Example">TuxxOwneeClass Complete Example</a>
</ol>
## <a id="Premise"></a>Premise [#](#Premise)
>The `OwneeClass` is an opinionated [React](http://facebook.github.io/react/) class that is not designed to manage any of its own state other than, in some cases, necessary state to implement two-way data-binding for input validation. Instead the `OwneeClass` uses dynamic properties passed down by `props` as per the normal `React` workflow, and static properties and methods shared automatically by the nearest parent `OwnerClass` component. The `OwnerClass` shares these properties and methods with the `OwneeClass` without having to cascade those properties down as per the usual `React` workflow.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
An `OwnerClass` will use the `registerOwnerProps` method to specifiy methods and `props` that they want to share with their children. Then when an `OwneeClass` component mounts, they automatically receive the `nearestOwnerProps` object.

### <a id="Requiring-OwneeClass"></a>1) Requiring OwneeClass [#](#Requiring-OwneeClass)
The `OwneeClass` is exposed as a method under `tuxx/React` via:

```javascript
    var React = require('tuxx/React');
    console.assert(React.createOwneeClass);
```

***

### <a id="Creating-an-OwneeClass-Component"></a>2) Creating an OwneeClass Component [#](#Creating-an-OwneeClass-Component)
The `React` object allows us to create `TuxxOwneeClass` components. These components take advantage of the shared properties and methods that are available to them through `nearestOwnerProps`. Let's take a look at an example: [#](#Creating-an-OwneeClass-Component-Example)
<a id="Creating-an-OwneeClass-Component-Example"></a>

```javascript
    var React = require('tuxx/React');

    var Message = React.createOwneeClass({
      var message = this.props.message;

      render: function () {
        return (
          <li key={message.id}>
            {message.username} - {message.text} <br />
            <button onClick={this.nearestOwnerProps.deleteMessage}>Delete</button>
            <button onClick={this.nearestOwnerProps.updateMessage}>{this.state.editing ? 'Cancel' : 'Edit'}</button>
          </li>
        );
      }
    });

    module.exports = Message;
```

Some of this should look familiar as the `createOwneeClass` is an implementation on top of the `React.createClass` method. Which means that it has access to all of the same [lifecycle](http://facebook.github.io/react/docs/component-specs.html) methods as a normal `React` class. Additionally, it requires a `render` method just like any other `React` component.

You can also see that we are using `React's` [JSX](http://facebook.github.io/react/docs/displaying-data.html) syntax here. We are able to do this because when we require in our `tuxx/React` module we assign it to a variable name `React`. JSX automatically translates into `React.METHOD NAME`, thus by writing `var React = require('tuxx/React')` we can leverage JSX syntax.

If you are unfamiliar with `React` components please review their [docs](http://facebook.github.io/react/). Below is the API documentation for the `createOwneeClass` method.

***

### <a id="React-createOwneeClass"></a>3) React.createOwneeClass [#](#React-createOwneeClass)
Returns an `OwneeClass` based on the passed in `owneeClassProps`

```javascript
    var OwneeClass = React.createOwneeClass(owneeClassProps);
```

***

#### <a id="createOwneeClass-owneeClassProps"></a>3.1) Parameter - `owneeClassProps` - type: OBJECT - required [#](#createOwneeClass-owneeClassProps)
Properties of the `OwneeClass` to be created. Expected keys:

##### <a id="owneeClassProps-render"></a>Property - `owneeClassProps.render` - type: FUNCTION - required [#](#owneeClassProps-render)
As with any other `React` class, a [render](#http://facebook.github.io/react/docs/component-specs.html#render) method is required. This method is responsible for returning a `React Element` which can be rendered onto the DOM.

```javascript
    owneeClassProps.render = function () {
      return (
        <div>
          <h1>hello world</h1>
        </div>
      );
    };
```

##### <a id="owneeClassProps-LIFECYCLE_AND_SPECS"></a>Methods/Properties - `owneeClassProps.LIFECYCLE_AND_SPECS` - type: FUNCTIONs - optional [#](#owneeClassProps-LIFECYCLE_AND_SPECS)
As with any other `React` class, the `owneeClassProps` can optionally include `React` [lifecycle methods and specs](#http://facebook.github.io/react/docs/component-specs.html).

```javascript
    owneeClassProps.componentDidMount = function () {
      roomActions.get();
    };
```

##### <a id="owneeClassProps-nearestOwnerPropTypes"></a>Property - `owneeClassProps.nearestOwnerPropTypes` - type: OBJECT - optional [#](#owneeClassProps-nearestOwnerPropTypes)
Allows you to perform prop validation on the `nearestOwnerProps` object on this component. For the full list of available properties that can be checked, please look at the [Reusable Components](http://facebook.github.io/react/docs/reusable-components.html) documentation.

```javascript
    owneeClassProps.nearestOwnerPropTypes = {
      deleteMessage: React.PropTypes.function.isRequired,
      editMessage: React.PropTypes.function.isRequired,
    };
```

##### <a id="owneeClassProps-anyPropTypes"></a>Property - `owneeClassProps.anyPropTypes` - type: OBJECT - optional [#](#owneeClassProps-anyPropTypes)
Allows you to perform prop validation on both the standard `props` of a component, as well as those `props` available via `nearestOwnerProps`. For the full list of available properties that can be checked, please look at the [Reusable Components](http://facebook.github.io/react/docs/reusable-components.html) documenation.

```javascript
    owneeClassProps.anyPropTypes = {
      message: React.PropTypes.object.isRequired,
      deleteMessage: React.PropTypes.function.isRequired,
      editMessage: React.PropTypes.function.isRequired
    };
```

**NOTE** When performing prop validations with `anyPropTypes` that `props` in `this.props` are validated first, so they will override the validation of the `nearestOwnerProps`. For example, in the above scenario if `this.props.message` is an object, but `this.nearestOwnerProps.message` is a string, then the message property will be treated as valid since `this.props` takes priority.

#### <a id="createOwneeClass-OwneeClass"></a>Return - `OwneeClass` - type: OBJECT [#](#createOwneeClass-OwneeClass)
The `createOwneeClass` method returns a `TuxxOwneeClass` which is an extension on top of a `React` Class. You can then simply use it to render components as you would any other `React` Class.

##### <a id="OwneeClass-nearestOwnerProps"></a>Property - `OwneeClass.nearestOwnerProps` [#](#OwneeClass-nearestOwnerProps)
Allows the `Ownee` to access the `nearestOwnerProps` on the closest `OwnerClass`.
The `nearestOwnerProps` should be static, if you need to pass in dynamic `props` use the standard `React` `props` pass down syntax.

**NOTE** `nearestOwnerProps` should be treated as immutable just like standard component props. Thus, you should never modify the `nearestOwnerProps` object. It is designed to store static methods and data.

***

### <a id="TuxxOwneeClass-Guidelines"></a>4) TuxxOwneeClass Guidelines [#](#TuxxOwneeClass-Guidelines)
It is quite possible to never take advantage of the versatility that is provided by using the `nearestsOwnerProps`. Yet you would be missing out on the benefits that it provides. Passing properties down through a multitude of components is error prone, as it is easy to forget to pass all properties or methods that you need. Part of this difficulty can be alleviated by using `propTypes` to validate a component's prop inputs and using the `React Spread` syntax to cascade down properties. However, even with those tools prop sharing is difficult and fragile. Additionally, it significantly hurts our ability to reuse components since our components now have to request `props` that they would not normally need just so that they can share those `props` with their children. Finally, cascading down `props` makes your `React` components vulnerable to refactoring/changes in component structure since you have to make sure you have the correct `props` in the correct places whenever you want to restructure your components. With `Tuxx`, as long as the `nearestOwnerClasss` to the component doesn't change you can freely refactor your `React` structure without having to worry about losing access to your needed properties.

```javascript
    //BAD
    var React = require('tuxx/React');

    // Passing properties down using the standard React prop syntax can be error prone, as you will have to manage and track sharing your methods throughout your component hierarchy.
    var Message = React.createOwneeClass({
      render: function () {
        return (
          <div>
            <p>{this.props.message.text}</p>
            <button onClick={this.props.deleteMessage}>Delete</button>
            <button onClick={this.props.editMessage}>Edit</button>
          </div>
        );
      }
    });

    //GOOD
    var React = require('tuxx/React');

    // The nearestOwnerProps allows you to access shared methods and properties. It also reduces errors by not requiring you to pass properties or methods through components that do not require them.
    var Message = React.createOwneeClass({
      render: function () {
        // We still need to access the message object through this.props because the message object is dynamic and can update, while the properties and methods shared on nearestOwnerProps cannot
        return (
          <div>
            <p>{this.props.message.text}</p>
            <button onClick={this.nearestOwnerProps.deleteMessage}>Delete</button>
            <button onClick={this.nearestOwnerProps.editMessage}>Edit</button>
          </div>
        );
      }
    });
```

***

### <a id="TuxxOwneeClass-Complete-Example"></a>5) TuxxOwneeClass Complete Example [#](#TuxxOwneeClass-Complete-Example)
Taking all that we have learned so far let's take a look at a more realistic example.

```javascript
    var React = require('tuxx/React');

    var Message = React.createOwneeClass({
      anyPropTypes: {
        message: React.PropTypes.object.isRequired
      },

      nearestOwnerPropTypes: {
        deleteMessage: React.PropTypes.function.isRequired,
        editMessage: React.PropTypes.function.isRequired
      },

      getInitialState: function () {
        return {
          editing: false
        };
      },

      updateMessage: function (e) {
        e.preventDefault();
        var messageNode = this.refs.editMessage.getDOMNode();
        this.nearestOwnerProps.updateMessage(messageNode.value, this.props.message.id);
        messageNode.value = '';
        this.edit();
      },

      edit: function (e) {
        e.preventDefault();
        if (this.isMounted()) {
          this.setState({ editing: !this.state.editing });
        }
      },

      deleteMessage: function (e) {
        e.preventDefault();
        this.nearestOwnerProps.deleteMessage(this.props.message.id);
      },

      render: function () {
        var editForm;
        var message = this.props.message;
        if (this.state.editing) {
          editForm = (
            <div>
              <input ref="editMessage" defaultValue={message.text} />
              <button onSubmit={this.updateMessage}>Edit</button>
            </div>
          );
        }

        return (
          <li key={message.id}>
            {message.username} - {message.text} <br />
            {editForm}
            <button onClick={this.deleteMessage}>Delete</button>
            <button onClick={this.edit}>{this.state.editing ? 'Cancel' : 'Edit'}</button>
          </li>
        );
      }
    });

    module.exports = Message;
```

This should illustrate some of the versatility and utility of the `OwneeClass`. Not only does it allow for easy to reason about propagation of properties and methods down through components, it also allows you as a developer the versatility to ensure that the proper methods are being exposed to your children components.
