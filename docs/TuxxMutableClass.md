# TuxxMutableClass

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type: upper-alpha;">
      <li><a href="#Requiring-TuxxMutableClass">Requiring TuxxMutableClass</a></li>
      <li><a href="#creating-mutable-class-components">Creating Mutable Class Components</a></li>
      <ol style="list-style-type: upper-roman;">
        <li><a href="#create-mutable-class-example">Create Mutable Class Example</a></li>
        <li><a href="#React-createMutableClass">METHOD: React.createMutableClass</a>
          <ol style="list-style-type: lower-alpha;">
            <li><a href="#mutableClassProps-mutableTraits">PROPERTY: mutableClassProps.mutableTraits</a></li>
          </ol>
        </li>
      </ol>
    </ol>
  </li>
  <li><a href="#TuxxMutableClass-Guidelines">TuxxMutableClass Guidelines</a></li>
  <li><a href="#TuxxMutableClass-Complete-Example">TuxxMutableClass Complete Example</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>The `TuxxMutableClass` is an opinionated type of [React](http://facebook.github.io/react/) class designed compare specified mutable traits to determine if a component should re-render.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
`Tuxx` determines if a mutable class component should re-render by taking advantage of the `componentWillMount` and `shouldComponentUpdate` lifecycle events. Specifically, in the `componentWillMount` lifecycle, the component will do a deep search of its `state` and `props` to create paths to the specified `mutableTraits`. The paths are then attached to the constructor's prototype, such that a deep search to create the paths only needs to be done once for a particular component class.

These `mutableTraits` paths are then used in the `shouldComponentUpdate` lifecycle event to see if those properties have changed when comparing the current state and props to the next props and state of the component. If those state and/or props have not changed then `shouldComponentUpdate` will return false which indicates to React that it does not need to update the component in the DOM. By performing this check you can prevent the unneeded re-rendering of components within the virtual DOM each time a potential re-render is triggered.

The mutable class in `Tuxx` is an extension of the `OwneeClass`, which is an implementation on top of React's `createClass` method. In laymen's terms this means that it has access to all of the same [lifecycle](http://facebook.github.io/react/docs/component-specs.html) methods as a normal React class. Additionally, it requires a `render` method just like any other React component.

***

### <a id="Requiring-TuxxMutableClass"></a>1) Requiring TuxxMutableClass [#](#Requiring-TuxxMutableClass)
The `TuxxMutableClass` method `createMutableClass` is exposed by requiring the `Tuxx` React module, which can be required via:

```javascript
  var React = require('tuxx/React');
```

**Note that at this time for `Tuxx` to be compiled by the JSX transformer, the `Tuxx` module must be assigned to the variable name `React`**

***

### <a id="creating-mutable-class-components"></a>2) Creating Mutable Class Components [#](#creating-mutable-class-components)
The `Tuxx` extended `React` object allows users to create mutable class components via invoking [React.createMutableClass](#createMutableClass). Pass in an object to the `createMutableClass` method and it will return a `TuxxMutableClass` which is an extension of a generic React Class.

Let's take a look at an example: [#](#create-mutable-class-example)
<a id="create-mutable-class-example"></a>

```javascript
  var Message = React.createMutableClass({
    // the traits we want to watch to see if a re-render is required
    mutableTraits: {
      props: ['text', 'timestamp'],
      state: 'editing'
    },

    render: function () {
      return (
        <div>
          <h1>{this.props.message.text}</h1>
        </div>
      );
    }
  });
```

Below is the api documentation for this method.

***

### <a id="React-createMutableClass"></a>3) React.createMutableClass [#](#React-createMutableClass)

```javascript
  var Message = React.createMutableClass(mutableClassProps);
```

***

#### <a id="createMutableClass-mutableClassProps"></a>3.1) Parameter - `mutableClassProps` - type: OBJECT - required [#](#createMutableClass-mutableClassProps)
Methods and properties to extend the returned `mutableClass` object with. Expected keys:

##### <a id="mutableClassProps-mutableTraits"></a>Property - `mutableClassProps.mutableTraits` - type: OBJECT - optional [#](#mutableClassProps-mutableTraits)
The traits that will be registered onto the mutable class.

**NOTE: If the `mutableTraits` property is not included in the `mutableClassProps` object, instead of applying the TuxxMutableRenderMixin to the return object, the PureRenderMixin will be applied instead. The PureRenderMixin implements `shouldComponentUpdate`, but it only does a shallow compare of the top-most keys in props and state.**

Expected keys:

###### <a id="mutableTraits-props"></a>Property - `mutableTraits.props` - type: STRING, ARRAY of STRINGs, ARRAY of ARRAYs of STRINGs - optional [#](#mutableTraits-props)
A trait, or array of traits, or an array of arrays of traits, within the components props object to create a path for. An example will follow the `mutableTraits.state` explanation.

###### <a id="mutableTraits-state"></a>Property - `mutableTraits.state` - type: STRING, ARRAY of STRINGs, ARRAY of ARRAYs of STRINGs - optional [#](#mutableTraits-state)
A trait, or array of traits, or an array of arrays of traits, within the components state object to create a path for.

```javascript
    var mutableClassProps = {};
    mutableClassProps.mutableTraits = {
      props: 'text',
      state: 'editing'
    };

    // OR
    mutableClassProps.mutableTraits = {
      props: ['text', 'timestamp'],
      state: 'editing'
    };

    // OR it is possible to specify the hierarchy of keys to search through to improve performance of the one time deep search/provide greater specificity regarding the required property
    mutableClassProps.mutableTraits = {
      props: [
        ['message', 'text'],
        ['message', 'timestamp']
      ],
      state: 'editing'
    };
```

***

#### <a id="mutableClassProps-render"></a>3.2) Parameter - `mutableClassProps.render` - type: FUNCTION - required [#](#mutableClassProps-render)
As with any other `React` class, a [render](#http://facebook.github.io/react/docs/component-specs.html#render) method is required. This method is responsible for returning a `React Element` which can be rendered onto the DOM.

```javascript
    mutableClassProps.render = function () {
      return (
        <div>
          <h1>hello world</h1>
        </div>
      );
    };
```

***

#### <a id="mutableClassProps-LIFECYCLE_AND_SPECS"></a>3.3) Methods/Properties - `mutableClassProps.LIFECYCLE_AND_SPECS` - type: FUNCTIONs - optional [#](#mutableClassProps-LIFECYCLE_AND_SPECS)
As with any other `React` class, the `mutableClassProps` can optionally include `React` [lifecycle methods and specs](#http://facebook.github.io/react/docs/component-specs.html).

```javascript
    mutableClassProps.componentDidMount = function () {
      roomActions.get();
    };
```

#### <a id="createMutableClass-mutableClass"></a>Return - `mutableClass` - type: OBJECT [#](#createMutableClass-mutableClass)
Returns a React class augmented with special `Tuxx` mixins.

***

## <a id="TuxxMutableClass-Guidelines"></a>TuxxMutableClass Guidelines [#](#TuxxMutableClass-Guidelines)
We recommend using the mutable class in situations where you are rendering many components of the same class, and only some of the state and props in those components will ever update.

A specific example is if you have tens or hundreds of message components rendering on the screen. The mutable class would be beneficial at that point because most of those message components can update, but will not necessarily update with great frequency. Therefore having components that will check to see if they should re-render in the virtual DOM can result in a performance boost with the more messages that are on the screen. If someone edits the text of a message, instead of re-rendering all of the other messages in the virtual DOM, the mutable class will only re-render the message that has to update.

***

## <a id="TuxxMutableClass-Complete-Example"></a>TuxxMutableClass Complete Example [#](#TuxxMutableClass-Complete-Example)
Taking all that we have learned so far let's take a look at a more realistic example.

```javascript
    var React = require('tuxx/React');

    var Message = React.createMutableClass({
      mutableTraits: {
        props: [
          ['message', 'text']
        ],
        state: 'editing'
      },

      getInitialState: function () {
        return {
          editing: false
        };
      },

      deleteMessage: function(e) {
        e.preventDefault();
        this.nearestOwnerProps.deleteMessage(this.props.message.id); // the mutableClass is a child of an ownerClass component
      },

      updateMessage: function (e) {
        e.preventDefault();
        var messageNode = this.refs.editMessage.getDOMNode();
        this.nearestOwnerProps.updateMessage(message.value, this.props.message.id);
        messageNode.value = '';
        this.edit();
      },

      edit: function(e) {
        e.preventDefault();
        if (this.isMounted()) {
          this.setState({ editing: !this.state.editing });
        }
      },

      render: function () {
        var editForm;
        var message = this.props.message;

        if (this.state.editing) {
          editForm = (
            <div>
              <input ref="editMessage" defaultValue={message.text} />
              <button onClick={this.updateMessage}>Edit</button>
            </div>
          );
        }

        return (
          <li>
            {message.username} - {message.text} <br />
            {editForm}
            <button onClick={this.deleteMessage}>Delete</button>
            <button onClick={this.edit}>Edit</button>
          </li>
        );
      }
    });
```

In this example the Message component takes advantage of the mutable class by registering the `this.state.editing` and `this.props.message.text` as the mutable traits of this component using the `mutableTraits` property. Whenever this component is triggered to update it will check to see if `this.state.editing` and/or `this.props.message.text` has updated. If neither has then `shouldComponentUpdate` will return false and the component will not need to re-render in the virtual DOM.
