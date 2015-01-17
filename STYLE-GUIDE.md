### Indentation

When writing any block of code that is logically subordinate to the line immediately before and after it, that block should be indented two spaces more than the surrounding lines

* Do not put any tab characters anywhere in your code. You would do best to stop pressing the tab key entirely.
* Increase the indent level for all blocks by two extra spaces
  * When a line opens a block, the next line starts 2 spaces further in than the line that opened

  ```javascript
      // good:
      if (condition) {
        action();
      }

      // bad:
      if (condition) {
      action();
      }
  ```

  * When a line closes a block, that line starts at the same level as the line that opened the block
  ```javascript
      // good:
      if (condition) {
        action();
      }

      // bad:
      if (condition) {
        action();
        }
  ```

  * No two lines should ever have more or less than 2 spaces difference in their indentation. Any number of mistakes in the above rules could lead to this, but one example would be:

    ```javascript
      // bad:
      transmogrify({
        a: {
          b: function(){
          }
    }});
    ```

  * Use Sublime's arrow collapsing as a guide. Do the collapsing lines seem like they should be 'contained' by the line with an arrow on it?

### Language constructs

* Do not use `for...in` statements with the intent of iterating over a list of numeric keys. Use a for-with-semicolons statement in stead.

```javascript
    // good:
    // declare iterator variables and length before entering the loop
    var i, listLength;
    var list = ['a', 'b', 'c'];
    listLength = list.length;

    for (i = 0; i < listLength; i++) {
      alert(list[i]);
    }

    // bad:
    var list = ['a', 'b', 'c'];
    for (var i in list) {
      alert(list[i]);
    }
```

* Never omit braces for statement blocks (although they are technically optional).
```javascript
    // good:
    for (key in object) {
      alert(key);
    }

    // bad:
    for (key in object)
      alert(key);
```

* Always use `===` and `!==`, since `==` and `!=` will automatically convert types in ways you're unlikely to expect.

```javascript
    // good:

    // this comparison evaluates to false, because the number zero is not the same as the empty string.
    if (0 === '') {
      alert('looks like they\'re equal');
    }

    // bad:

    // This comparison evaluates to true, because after type coercion, zero and the empty string are equal.
    if (0 == '') {
      alert('looks like they\'re equal');
}
```

### Semicolons

* Don't forget semicolons at the end of lines.

```javascript
    // good:
    alert('hi');

    // bad:
    alert('hi')
```

* Semicolons are not required at the end of statements that include a block--i.e. `if`, `for`, `while`, etc.

```javascript
    // good:
    if (condition) {
      response();
    }

    // bad:
    if (condition) {
      response();
    };
```

* Misleadingly, a function may be used at the end of a normal assignment statement, and would require a semicolon (even though it looks rather like the end of some statement block).

```javascript
    // good:
    var greet = function () {
      alert('hi');
    };

    // bad:
    var greet = function () {
      alert('hi');
    }
```

# Supplemental reading

### Comments

* Provide comments any time you are confident it will make reading your code easier.
* Be aware that comments come at some cost. They make a file longer and can drift out of sync with the code they annotate.
* Comment on what code is attempting to do, not how it will achieve it.
* A good comment is often less effective than a good variable name.


### Padding & additional whitespace
TuxedoJS has a consistent convention for white space. There is a space after an `if`, `while`, `for`, `function`, etc, and then there is a space after the close parenthesis of the conditional, input arguments, etc. Maintaining this convention creates consistent code that is easy to review the content of without getting hung up on the formatting.

Always end your file with a newline.

```javascript
    // good:
    if (x === 0) {
      console.log('This is done correctly');
    }

    var timesTwo = function (x) {
      return x * 2;
    };

    for (var i = 0; i < 10; i++) {
      console.log('i is: ' + i);
    }

    // bad:
    if(x !== 1){
      console.log('This is not following our convention');
    }

    var timesThree = function(x){
      return x * 3;
    };
```

* You are not allowed to align two similar lines in TuxedoJS. This pattern usually leads to unnecessary edits of many lines in your code every time you change a variable name.

    ```javascript
      // not allowed:
      var firstItem  = getFirst ();
      var secondItem = getSecond();
    ```

* Put `else` and `else if` statements on the same line as the ending curly brace for the preceding `if` block
    ```javascript
      // good:
      if (condition) {
        response();
      } else {
        otherResponse();
      }

      // bad:
      if (condition) {
        response();
      }
      else {
        otherResponse();
      }
    ```

### Opening or closing too many blocks at once

* The more blocks you open on a single line, the more your reader needs to remember about the context of what they are reading. Try to resolve your blocks early, and refactor. A good rule is to avoid closing more than two blocks on a single line--three in a pinch.

    ```javascript
      // avoid:
      _.ajax(url, {success: function(){
        // ...
      }});

      // prefer:
      _.ajax(url, {
        success: function () {
          // ...
        }
      });
    ```

### Variable declaration

* Use a new var statement for each line you declare a variable on.
* Do not break variable declarations onto multiple lines.
* Use a new line for each variable declaration.
* See http://benalman.com/news/2012/05/multiple-var-statements-javascript/ for more details

    ```javascript
      // good:
      var ape;
      var bat;

      // bad:
      var cat,
          dog

      // use sparingly. Tux tends to use it specifically when declaring variables that are reused:
      var eel, fly;
    ```

### Capital letters in variable names

* TuxedoJS follows standard camelCase variable naming. If you are creating a constructor function that will be invoked using new or a similar object creation pattern, the first letter of the variable name should be capitalized as well.

### Minutia

* For lists, put commas at the end of each newline, not at the beginning of each item in a list

    ```javascript
      // good:
      var animals = [
        'ape',
        'bat',
        'cat'
      ];

      // bad:
      var animals = [
          'ape'
        , 'bat'
        , 'cat'
      ];
    ```

* Avoid use of `switch` statements altogether. They are hard to outdent using the standard whitespace rules above, and are prone to error due to missing `break` statements. See [this article](http://ericleads.com/2012/12/switch-case-considered-harmful/) for more detail.

* Prefer single quotes around JavaScript strings, rather than double quotes. Having a standard of any sort is preferable to a mix-and-match approach, and single quotes allow for easy embedding of HTML, which prefers double quotes around tag attributes.

    ```javascript
      // good:
      var dog = 'dog';
      var cat = 'cat';

      // acceptable:
      var dog = "dog";
      var cat = "cat";

      // bad:
      var dog = 'dog';
      var cat = "cat";
    ```
