# Tux Modularity
## Table of Contents
<ol>
  <li><a href="#Premise">Premise</a></li>
  <li><a href="#Implementation">Implementation</a></li>
</ol>
## <a id="Premise"></a>Premise [#](#Premise)
>Tux is a completely modular framework. This means that you can use as much or as little of Tux as you want in your own development projects. Whereas, most other frameworks have your require the whole framework every time you want to use a feature of it, with Tux you only have to require the Tux module you need and not the entire framework.

## <a id="Implementation"></a>Implementation [#](#Implementation)
Tux's modular nature allows you to only require specifics modules you need. For example, if you wanted to require React and the default Fade animation component in your particular project, you need only:

```javascript
  var React = require('tux/React');
  var Fade = require('tux/Animations/Fade');
```

Requiring specific Tux modules is simple. All you need to do is follow a basic folder hierarchy path in your require statements. Every Tux require statement starts with a **lowercase** `tux` followed by a `/`, the **capitalized** sub directory you want to require and another `/` and **capitalized** module name for each level of specificity within that folder.

**Note** When requiring a module like `('tux/Animations')`, it will look at the index.js file within that module by default. In this case, the index.js within Animations exposes the `createAnimation` function by requiring TuxAnimations from Tux.
