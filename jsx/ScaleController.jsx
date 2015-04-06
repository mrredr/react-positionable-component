var React = require("react");

var RotationController = React.createClass({
  mixins: [
    require("./Transform-mixin")
  ],

  getInitialState: function() {
    return { base: 1, scale: 1 };
  },

  render: function() {
    return (
      <div className="scale-control"
           /*onClick={this.toggle}*/
           onMouseDown={this.state.activated ? this.startReposition : false}
           onTouchStart={this.state.activated ? this.startReposition : false}>⇲</div>
    );
  },

  handleTransform: function() {
    if (this.props.origin && this.props.onScale) {
      with(this.state) {
        var dimensions = this.props.origin.getDOMNode().getBoundingClientRect();
        var xOffset = dimensions.left + (dimensions.right - dimensions.left)/2;
        var yOffset = dimensions.top + (dimensions.bottom - dimensions.top)/2;
        //  vector 1:
        var x1 = xMark - xOffset,
            y1 = yMark - yOffset;
        //  vector 2:
        var x2 = (xMark + xDiff) - xOffset,
            y2 = (yMark + yDiff) - yOffset;
        // normalised vector 1:
        var m1 = Math.sqrt(x1*x1 + y1*y1),
            nx1 = x1 / m1,
            ny1 = y1 / m1;
        // projection of vector 2 onto vector 1 involves
        // finding the projection scale factor, which is
        // exactly what we need:
        var scale = (x2*nx1 + y2*ny1) / m1;
        // communicate scale to owner
        this.setState(
          { scale: scale/2 },
          function() { this.props.onScale(this.state.base + scale); }
        );
      }

    }
  },

  handleTransformEnd: function() {
    this.setState({
      base: this.state.base * this.state.scale
    });
  }
});

module.exports = RotationController;

