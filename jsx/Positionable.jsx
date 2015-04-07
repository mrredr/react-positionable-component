"use strict";

var React = require("react/dist/react.min");


function fixTouchEvent(evt) {
  evt.clientX = parseInt( evt.touches[0].pageX, 10);
  evt.clientY = parseInt( evt.touches[0].pageY, 10);
}


var ZIndexController = require("./ZIndexController.jsx");
var RotationController = require("./RotationController.jsx");
var ScaleController = require("./ScaleController.jsx");
var classes = require("classnames");

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

  componentWillMount: function() {
    console.log("toggling");
    this.toggle();
  },

  render: function() {
    var x = this.state.x + this.state.xDiff;
    var y = this.state.y + this.state.yDiff;

    var angle = (180 * this.state.angle / Math.PI)

    var style = {
      transform: [
        "translate("+x+"px, "+y+"px)",
        "rotate("+angle+"deg)",
        "scale("+this.state.scale+")"
      ].join(" "),
      transformOrigin: "center",
      zIndex: this.state.zIndex
    };

    var className = classes({
      positionable: true,
      activated: this.state.activated
    });

    return (
      <div style={style}
       className={className}
       onMouseDown={this.state.activated ? this.startReposition : false}
       /*
       onTouchStart={this.startRepositionTouch}
       onTouchMove={this.repositionTouch}
       onTouchEnd={this.endRepositionTouch}
       */
       onTouchStart={this.touchStart}
       onTouchMove={this.touchMove}
       onTouchEnd={this.touchEnd}
      >

        <RotationController angle={this.state.angle} activated="true" origin={this} onRotate={this.handleRotation} />
        <ScaleController    scale={this.state.scale} activated="true" origin={this} onScale={this.handleScaling}   />
        <ZIndexController   zIndex={1} onChange={this.handleZIndexChange} />

        {this.props.children}
      </div>
    );
  },

  touchStart: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch start " + evt.touches[0].pageX + "/" + evt.touches[0].pageY }})); },
  touchMove: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch move " + evt.touches[0].pageX + "/" + evt.touches[0].pageY }})); },
  touchEnd: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch end " + evt.touches[0].pageX + "/" + evt.touches[0].pageY }})); },

/*
  touchStart: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch start " + evt.clientX + "/" + evt.clientY }})); },
  touchMove: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch move " + evt.clientX + "/" + evt.clientY }})); },
  touchEnd: function(evt) { document.dispatchEvent (new CustomEvent("app:log", {detail: { msg: "touch end " + evt.clientX + "/" + evt.clientY }})); },
*/

  handleZIndexChange: function(z) { this.setState({ zIndex: z })},
  handleRotation: function(angle) { this.setState({ angle: angle }); },
  handleScaling: function(scale) { this.setState({ scale: scale }); },

  // Always useful to be able to extract this information, in case it needs
  // to be stored for future restoring.
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
