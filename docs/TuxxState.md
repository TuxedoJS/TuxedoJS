# Tuxx State
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
In React, because we never wanted to mutate `this.state` directly, the primary method of triggering UI updates from event handlers and server request callbacks is by using `this.setState` or `this.replaceState`. Calling these methods creates a pending state transition which, when called upon (and never guaranteed to happen synchronously), force the component to re-render and execute a callback function, if passed one.

The caveat is that `this.setState(newState)` merely merges `newState` with `this.state`, and `this.replaceState(newState)` simply deletes any pre-existing keys from `this.state` that are not in `newState`. This limited flexibility

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
