# Tuxx/Architecture

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a>
    <ol style="list-style-type:upper-alpha">
      <li><a href="#Architecting-Store-Dependencies">Architecting Store Dependencies</a>
        <ol style="list-style-type:upper-roman">
          <li><a href="#Architecting-Store-Dependencies-Example">Architecting Store Dependencies Example</a></li>
          <li><a href="#Architecture-architect">METHOD: Architecture.architect</a></li>
          <li><a href="#architectureChain">OBJECT: architectureChain</a>
            <ol style="list-style-type:lower-alpha">
              <li><a href="#architectureChain-itNeeds">METHOD: architectureChain.itNeeds</a></li>
              <li><a href="#architectureChain-itOutputs">METHOD: architectureChain.itOutputs</a></li>
              <li><a href="#architectureChain-and">METHOD: architectureChain.and</a></li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>TuxedoJS provides a novel approach for describing the dependencies between stores. In Flux, store dependencies are defined via the `Dispatcher.waitFor` syntax. This allows stores to define the order at which they will receive events from the dispatcher. While this syntax is workable, we consider it to be flawed due to the fact that it requires each store to separately manage the stores it needs to waitFor. This can result in distributed app architectures that are difficult to reason about. For an engineer to understand all the store relationships in an app, he/she would need to step through every store file and draw out a map of the stores that it is dependent on. TuxedoJS tackles this problem by centralizing waitFor statements and providing a more semantic interface for building waitFor relationships.

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
TuxedoJS provides two major innovations for defining store dependencies:

1. It allows you to write all of your store dependencies in a single location. This means that **one** file is responsible for managing your app's architecture.
2. It allows you to describe your store dependencies in terms of the inputs to and outputs from each of your stores.

### <a name="Requiring-Architecture"></a>1) Requiring Architecture [#](#Requiring-Architecture)
The Architecture interface is exposed via:

```javascript
    var Architecture = require('tuxx/Architecture');
```

***

### <a id="Architecting-Store-Dependencies"></a>2) Architecting Store Dependencies [#](#Architecting-Store-Dependencies)
Let's take a look at an example. Imagine we want to describe the following network of store dependencies, where each store is dependent on the store it points to: [#](#Architecting-Store-Dependencies-Example)
<a id="Architecting-Store-Dependencies-Example"></a>

```javascript
    userStore <---privateMessageStore
        ^               ^
        |               |
    roomStore <---------|
        ^               |
        |               |
    threadStore <---unreadStore
        ^               |
        |               |
    messageStore <------|
```

In Flux we would need to write these dependencies spread out across six different files, while on the other hand, in TuxedoJS, we can accomplish all of this in just one file:

```javascript
    var userStore = require('../stores/userStore');
    var roomStore = require('../stores/roomStore');
    var threadStore = require('../stores/threadStore');
    var messageStore = require('../stores/messageStore');
    var privateMessageStore = require('../stores/privateMessageStore');
    var unreadStore = require('../stores/unreadStore');

    var architect = require('tuxx/Architecture').architect;

    architect(userStore).itOutputs('users');
    architect(roomStore).itNeeds('users').itOutputs('rooms', 'unreadCount');
    architect(threadStore).itNeeds('rooms').itOutputs('threads', 'unreadCount');
    architect(messageStore).itNeeds('threads').itOutputs('messages', 'unreadCount');
    architect(privateMessageStore).itNeeds('users').itOutputs('privateMessages', 'unreadCount');
    architect(unreadStore).itNeeds('unreadCount');
```

TuxxArchitecture also supports arrays of inputs for `itNeeds` and `itOutputs` as well as the ability to chain invocations of these functions via the `and` method (it copies the last method invoked). For example, we could rewrite the `architect(roomStore)` call from the previous example as:

```javascript
    architect(roomStore).itNeeds('users').itOutputs(['rooms', 'unreadCount']); //OR
    architect(roomStore).itNeeds('users').itOutputs('rooms').and('unreadCount');
```

If we decided that the `unreadStore` was also dependent on the `userStore` we could write:

```javascript
    architect(unreadStore).itNeeds('unreadCount', 'users'); //OR
    architect(unreadStore).itNeeds(['unreadCount', 'users']); //OR
    architect(unreadStore).itNeeds('unreadCount').and('users');
```

Lastly, you have the option to directly need stores if you do not want to use this string based syntax:

```javascript
    architect(roomStore).itNeeds(userStore);
    architect(threadStore).itNeeds(userStore, roomStore);
    architect(messageStore).itNeeds(userStore, threadStore);
    architect(privateMessageStore).itNeeds(userStore);
    architect(unreadStore).itNeeds(roomStore, threadStore, messageStore, privateMessageStore);
```

While this approach is shorter it can be advantageous to use the string approach, as it allows you to write your dependencies in terms of the actual outputs of your stores and thus provides self-documenting code that can make it easier to reason about your application architecture down the line.

Below is the full API documentation for the `architect` method.

***

#### <a id="Architecture-architect"></a>2.1) Architecture.architect [#](#Architecture-architect)
Accepts a store and returns an `architectureChain` instance to define the store's inputs and outputs.

```javascript
    var architectureChain = Architecture.architect(storeToArchitect);
```

***

##### <a id="architect-storeToArchitect"></a>2.1.1) Parameter - `storeToArchitect` - type: OBJECT - required [#](#architect-storeToArchitect)
Store to architect. The returned architectureChain instance will be able to add dependencies to this store, and define the outputs that other stores can use to add a dependency for this store.

```javascript
    var storeToArchitect = require('../stores/userStore');
```

##### <a id="architect-architectureChain"></a>Return - `architectureChain` - type: OBJECT [#](#architect-architectureChain)
Object to chain architecture methods onto. It is defined below.

***

#### <a id="architectureChain"></a>2.2) architectureChain - type: OBJECT [#](#architectureChain)
The `architectureChain` instance returned from the `Architecture.architect` method. It possesses the following methods, each of which return this same architectureChain instance in order to allow method chaining:

***

##### <a id="architectureChain-itNeeds"></a>2.2.1) Method - `architectureChain.itNeeds` - type: FUNCTION [#](#architectureChain-itNeeds)
Accepts any number of inputs: stores, output strings, or arrays of stores and/or output strings. Adds a dependency to the `storeToArchitect` for each store mapped to the passed in inputs. Returns this `architectureChain` instance for continued method chaining.

```javascript
    architectureChain.itNeeds(storeOrInput, additionalStoresOrInputs...);
```

###### <a id="itNeeds-storeOrInput"></a>Parameter - `storeOrInput` - type: STRING, OBJECT, ARRAY of STRINGs and/or OBJECTs - required [#](#itNeeds-storeOrInput)
Adds a dependency for the store or stores that map to the passed in string. If a store is passed in as an input, it adds a dependency for the passed in store. If an array is passed in is an input, it adds a dependency for each element in the passed in array. This method will do this for each input.

```javascript
    storeOrInput = 'users'; //OR
    storeOrInput = userStore;
```

The following examples demonstrate passing in multiple inputs to `itNeeds`.

```javascript
    storeOrInput = ['users', roomStore]; //OR

    storeOrInput = 'users';
    additionalStoreOrInput = roomStore;
```

###### <a id="itNeeds-architectureChain"></a>Return - `architectureChain` - type: OBJECT [#](#itNeeds-architectureChain)
Returns this `architectureChain` instance to allow for continued method chaining.

```javascript
  console.assert(architectureChain === architectureChain.itNeeds('users'));
```

***

##### <a id="architectureChain-itOutputs"></a>2.2.2) Method - `architectureChain.itOutputs` - type: FUNCTION [#](#architectureChain-itOutputs)
Accepts any number of inputs: strings to output or arrays of strings to output. Maps this `storeToArchitect` to the passed in output(s) so other stores can add dependencies for this store. If another store is already mapped to this output than stores that need the output will become dependent on both of these stores. Returns this `architectureChain` instance for continued method chaining.

```javascript
    architectureChain.itOutputs(output, additionalOutputs...);
```

###### <a id="itOutputs-output"></a>Parameter - `output` - type: STRING, ARRAY of STRINGs - required [#](#itOutputs-output)
Registers the store to the passed in `output` string such that other stores that need this `output` string will be dependent on this store. If an array is passed in the method registers the store with each `output` string in the passed in array. This method will perform this operation for each input. Multiple stores can have the same outputs, in which case a store that needs the string will be dependent on every store that outputs it.

```javascript
    output = 'rooms';
```

The following examples demonstrate passing in multiple inputs to `itOutputs`.

```javascript
    output = ['rooms', 'unreadCount']; //OR
    output = 'rooms'; additionalOutput = 'unreadCount';
```

###### <a id="itOutputs-architectureChain"></a>Return - `architectureChain` - type: OBJECT [#](#itOutputs-architectureChain)
Returns this `architectureChain` instance to allow for continued method chaining.

```javascript
  console.assert(architectureChain === architectureChain.itOutputs('users'));
```

***

##### <a id="architectureChain-and"></a>2.2.3) Method - `architectureChain.and` - type: FUNCTION [#](#architectureChain-and)
Clones the last invoked method for conjunctive method chaining. Thus, `and` will become the `itNeeds` method after `itNeeds` is invoked. After `itOuputs` is invoked `and` becomes the `itOutputs` method.

```javascript
    architectureChain.itOutputs('rooms');
    console.assert(architectureChain.and === architectureChain.itOutputs);

    architectureChain.itNeeds('users');
    console.assert(architectureChain.and === architectureChain.itNeeds);
```

TuxxArchitecture is a very simple module but its ramifications are dramatic. It turns the process of writing out store dependencies from tedious, confusing, and error-prone to easy, fun, and self-documenting.
