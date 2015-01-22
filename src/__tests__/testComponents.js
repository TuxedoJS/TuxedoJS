var React = require('tuxx/React');

//Creates a simple component to be used for testing
var Idea = React.createClass({
  render: function() {
    return (
      <div className="idea">
        this.props.text
      </div>
    );
  }
});

module.exports = Idea;
