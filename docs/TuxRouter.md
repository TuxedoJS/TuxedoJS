# Tux/Router

## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a></li>
  <li><a href="#Complete-Example">Complete Example</a></li>
</ol>

## <a id="Premise"></a>Premise [#](#Premise)
>The Tux Router simply exposes the functionality of the amazing `react-router` module and allows it to be easily accessible in your Tux projects. This documentation is borrowed from the `react-router` docs and is only slightly adjusted. To read more about the fabulous `react-router` visit the [`react-router` Github page.](https://github.com/rackt/react-router)

***

## <a id="Implementation"></a>Implementation [#](#Implementation)
To use the `react-router` in Tux, simply require the components you need. In this case, the `Route` and `RouterHandler` components.

```javascript
    var RouteHandler = require('tux/React/RouteHandler');
    var Route = require('tux/React/Route');
```

Tux breaks up the `react-router` into individual modules. Thus, in tux you can require the component you need through the `tux/Router/ROUTER_COMPONENT` path structure. For a full guide on all of `react-router's` components and implementation, please refer to the [React Router Guide.](https://github.com/rackt/react-router/blob/master/docs/guides/overview.md)

***

## <a id="Complete-Example"></a>Complete Example [#](#Complete-Example)

### Before

```javascript
    var React = require('react');
    var Router = require('react-router');
    var Route = Router.Route;
    var NotFoundRoute = Router.NotFoundRoute;
    var DefaultRoute = Router.DefaultRoute;
    var NotFound = require('./app/components/routes/NotFound.jsx');
    var Welcome = require('./app/components/Welcome.jsx');
    var rooms = require('./SampleData.js');
    var MessageView = require('./app/components/message/MessageView.jsx');
    var RoomView = require('./app/components/room/RoomView.jsx');
    var DefaultWelcome = require('./app/components/DefaultWelcome.jsx');

    var routes = (
      <Route name="app" path="/" handler={Welcome}>
        <DefaultRoute handler={DefaultWelcome} />
        <Route name="rooms" path="/rooms" handler={RoomView}>
          <Route name="rooms.room" path="/rooms/:roomId" handler={MessageView} />
        </Route>
        <NotFoundRoute handler={NotFound} />
      </Route>
    );

    Router.run(routes, function(Handler) {
      React.render(<Handler />, document.getElementById("main"));
    });
```

### After

```javascript
    var React = require('tux/React');
    var Route = require('tux/Router/Route');
    var NotFoundRoute = require('tux/Router/NotFoundRoute');
    var DefaultRoute = require('tux/Router/DefaultRoute');
    var NotFound = require('./app/components/routes/NotFound.jsx');
    var Welcome = require('./app/components/Welcome.jsx');
    var rooms = require('./SampleData.js');
    var MessageView = require('./app/components/message/MessageView.jsx');
    var RoomView = require('./app/components/room/RoomView.jsx');
    var DefaultWelcome = require('./app/components/DefaultWelcome.jsx');

    var routes = (
      <Route name="app" path="/" handler={Welcome}>
        <DefaultRoute handler={DefaultWelcome} />
        <Route name="rooms" path="/rooms" handler={RoomView}>
          <Route name="rooms.room" path="/rooms/:roomId" handler={MessageView} />
        </Route>
        <NotFoundRoute handler={NotFound} />
      </Route>
    );

    Router.run(routes, function(Handler) {
      React.render(<Handler />, document.getElementById("main"));
    });
```
