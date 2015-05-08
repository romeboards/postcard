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

  /***** internal canvas for ImageData manipulation *****/
  this._canvas = document.createElement('canvas');
  this._cxt = this._canvas.getContext('2d');

  var curr = this;

  /**
   * Method to get image data via proxy. Uses the JSONP library to get the raw image data, then
   * initializes a new Image object to use as a shell.
   * @private
   * @params {String} url - The URL of the image to load.
   */
  var init = function(url) {

    var regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if(url) {
      var isSecure = location.protocol === "https:";
      var proxyURL = curr.proxyURL + "?callback=?";

      // If url specified and is a url + if server is secure when image or user page is
      if(proxyURL && regex_url_test.test(proxyURL) && !(isSecure && proxyURL.indexOf('http:') == 0)) {
        //do nothing
      } else {
        console.error('bad or insecure server url combination.');
      }

      JSONP.get( proxyURL, { url: escape(url) }, function(data) {
        var newImage = new Image();
        newImage.onload = function () {
          this.width = curr._canvas.width = data.width;
          this.height = curr._canvas.height = data.height;
          curr.imgData = this;
          curr.imageloaded = true;

          // draws the image on the internal canvas so we can extract the ImageData from it 
          curr._cxt.drawImage(this, 0, 0, this.width, this.height);  

          // trigger a render of the postcard canvas  
          _triggerEvent(curr.ctx.canvas, "forcerender");         
        };
        newImage.src = data.data;
      });
    }
  }(this.url);

}
/**
 * Draw method for the image object. Only applies after image data is loaded via proxy
 */
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
/**
 * Get the actual image data
 * @returns {ImageData|Error} 
 */
PostcardImageObject.prototype.getImageData = function() {
  if(this.imageloaded) return this._cxt.getImageData(0, 0, this._canvas.width, this._canvas.height);
  else console.error("image not loaded");
};
/**
 * Set the new image data
 * @param {ImageData} newImageData - new ImageData object to set
 */
PostcardImageObject.prototype.setImageData = function(newImageData) {
  this._cxt.putImageData(newImageData, 0, 0);
  this.imgData.src = this._canvas.toDataURL();
};

/**
 * Get rotation of the image object.
 */
PostcardImageObject.prototype.getRotation = function() {
  return this.opts.rotation;
};
/**
 * Set rotation of the image object.
 * @param {Number} angle - Angle of rotation, in degrees;
 */
PostcardImageObject.prototype.setRotation = function(angle) {
  this.opts.rotation = angle % 360;
  _triggerEvent(this.ctx.canvas, "forcerender");
};