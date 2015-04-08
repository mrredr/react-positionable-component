"use strict";

var React = require("react/dist/react.min");
var classes = require("classnames");

var RotationController = require("./RotationController.jsx");
var ScaleController = require("./ScaleController.jsx");

var Positionable = React.createClass({
  mixins: [
    require("./Transform-mixin")
  ],

  getInitialState: function() {
    return {
      angle: this.props.angle || 0,
      scale: this.props.scale || 1,
      zIndex: this.props.zIndex || 1
    };
  },

  render: function() {
    var x = this.state.x + this.state.xDiff;
    var y = this.state.y + this.state.yDiff;

    var angle = (180 * this.state.angle / Math.PI);
    var scale = this.state.scale;
    var zIndex = this.state.zIndex;

    var style = {
      transform: [
        "translate("+x+"px, "+y+"px)",
        "rotate("+angle+"deg)",
        "scale("+scale+")"
      ].join(" "),
      transformOrigin: "center",
      zIndex: zIndex
    };

    var className = classes({
      positionable: true,
      activated: this.state.activated
    });

    return (
      <div style={style} className={className}>

        <div>
          layer position:
          <span className="zmod left" onClick={this.zDown}>◀</span>
          {this.state.zIndex}
          <span className="zmod right" onClick={this.zUp}>▶</span>
        </div>

        <RotationController angle={this.state.angle}   onRotate={this.handleRotation} activated="true" origin={this} />
        <ScaleController    scale={this.state.scale}   onScale={this.handleScaling}   activated="true" origin={this} />
        <button onClick={function() { alert('test'); }}>test</button>
        {this.props.children}
      </div>
    );
  },

  zUp: function(evt) {
    evt.stopPropagation();
    this.setState({ zIndex: this.state.zIndex + 1 }, function() {
      if(this.props.onChange) {
        this.props.onChange(this.state.zIndex);
      }
    });
  },

  zDown: function(evt) {
    evt.stopPropagation();
    this.setState({ zIndex: Math.max(0, this.state.zIndex - 1) }, function() {
      if(this.props.onChange) {
        this.props.onChange(this.state.zIndex);
      }
    });
  },

  handleRotation: function(angle) {
    this.setState({
      angle: angle
    });
  },

  handleScaling: function(scale) {
    this.setState({
      scale: scale
    });
  },

  handleZIndexChange: function(zIndex) {
    this.setState({
      zIndex: zIndex
    });
  },

  getTransform: function() {
    return {
      x: this.state.x,
      y: this.state.y,
      angle: this.state.angle,
      scale: this.state.scale
    };
  },

  setTransform: function(obj) {
    this.setState({
      x: obj.x || 0,
      y: obj.y || 0,
      angle: obj.angle || 0,
      scale: obj.scale || 1
    });
  }
});

module.exports = Positionable;
