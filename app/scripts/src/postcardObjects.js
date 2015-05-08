'use strict';

/**
 * Represents an internal object within the Postcard. Can be selected, redrawn, modified.
 * @constructor
 * @param {"text"|"image"|"shape"} type - The type of object being rendered
 * @param {CanvasRenderingContext2D} ctx - context in which to draw the object
 * @param {Object} [options] - Defines placement and content. 
 */
function PostcardObject(type, ctx, options) {

  var defaults = {
    x: 0,
    y: 0,
    w: 50,
    h: 50,
    fill: 'steelblue',
    selectable: false,
    zindex: 0,
    rotation: 0
  };

  this.ctx = ctx;
  this.type = type;
  this.opts = _extend( {}, defaults, options);  
  this.x = parseInt(this.opts.x);                           /* for brevitys sake */
  this.y = parseInt(this.opts.y);
  this.w = parseInt(this.opts.w);
  this.h = parseInt(this.opts.h);
};

/**
 * Generic draw method for PostcardObject.
 */
PostcardObject.prototype.draw = function() {

  // generic

  this.ctx.fillStyle = this.opts.fill;
  this.ctx.fillRect(this.x, this.y, this.w, this.h);
};


PostcardImageObject.prototype = new PostcardObject();
PostcardImageObject.prototype.constructor = PostcardImageObject;
/**
 * Represents an internal object within the Postcard. Can be selected, redrawn, modified.
 * @constructor
 * @extends PostcardObject
 * @param {String} url - URL to the image (relative or absolute)
 * @param {CanvasRenderingContext2D} ctx - context in which to draw the object 
 * @param {Object} [options] - Defines placement and content.  
 */
function PostcardImageObject(url, ctx, options) {
  PostcardObject.apply(this, ["image", ctx, options]);
  this.imageloaded = false;     // used to know when to start drawing
  this.url = url;

  var curr = this;
  var img = new Image;
  img.onload = function(){
    curr.imgData = img;
    curr.imageloaded = true;    
    _triggerEvent(curr.ctx.canvas, "forcerender");
  };
  img.src = this.url; 

}
PostcardImageObject.prototype.draw = function() {
  if(this.imageloaded) {
    var x = this.x, y = this.y;
    this.ctx.save();
    if(this.opts.rotation > 0) {
      this.ctx.translate(this.x + (this.w/2), this.y + (this.h/2)); 
      this.ctx.rotate(this.opts.rotation*Math.PI/180);
      x = -this.w/2; y = -this.h/2;
    }
    this.ctx.drawImage(this.imgData, x, y, this.w, this.h); // Or at whatever offset you like 
    this.ctx.restore();
  }
};
PostcardImageObject.prototype.getRotation = function() {
  return this.opts.rotation;
};
PostcardImageObject.prototype.setRotation = function(angle) {
  this.opts.rotation = angle;
  _triggerEvent(this.ctx.canvas, "forcerender");
};