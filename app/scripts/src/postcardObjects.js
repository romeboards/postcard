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
/**
 * Generic contains method for PostcardObject.
 * @returns {Boolean} if the coordinate is within the object's bounds
 */
PostcardObject.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
};
/**
 * Generic update method for PostcardObject.
 * @param {Object} newOptions - any options to update
 */
PostcardObject.prototype.update = function(newOptions) {
  this.opts = _extend( {}, this.opts, newOptions);  
  this.x = parseInt(this.opts.x);                           /* for brevitys sake */
  this.y = parseInt(this.opts.y);
  this.w = parseInt(this.opts.w);
  this.h = parseInt(this.opts.h);
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

  var imageDefaults = {
    keepOriginal: true,
    crop: false,
    cropX: 0,
    cropY: 0,
    cropW: 0,
    cropH: 0
  };
  this.opts = _extend( {}, imageDefaults, options); 
  PostcardObject.apply(this, ["image", ctx, this.opts]);
  this.imageloaded = false;     // used to know when to start drawing
  this.url = url;

  /***** internal canvas for ImageData manipulation *****/
  this._canvas = document.createElement('canvas');
  //document.body.appendChild(this._canvas);
  this._ctx = this._canvas.getContext('2d');

  var curr = this;

  /***** private methods *****/
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
        throw new Error('bad or insecure server url combination.');
      }

      JSONP.get( proxyURL, { url: escape(url) }, function(rawData) {
        var newImage = new Image();
        newImage.onload = function () {

          console.log("onload event");

          this.width = curr._canvas.width = rawData.width;
          this.height = curr._canvas.height = rawData.height;
          curr.imgElm = this;
          curr.imageloaded = true;

          // draws the image on the internal canvas so we can extract the ImageData from it 
          curr._ctx.drawImage(this, 0, 0, curr._canvas.width, curr._canvas.height); 

          // makes a copy of the ImageData object for reverting
          if(curr.opts.keepOriginal) {
            curr.origImgData = curr._ctx.getImageData(0, 0, curr._canvas.width, curr._canvas.height);
          }

          // trigger a render of the postcard canvas  
          _triggerEvent(curr.ctx.canvas, "forcerender"); 

          // ensure that this only occurs at first load, and not for subsequent image.src changes
          this.onload = onImageRefresh;      
        };
        newImage.src = rawData.data;
      });
    }
  };
  init(this.url);

  /**
   * Happens whenever image.src changes
   * @private
   */
  var onImageRefresh = function() {
    console.log('imagerefresh');
    _triggerEvent(curr.ctx.canvas, "forcerender"); 
  };

  /***** privileged methods *****/
  /**
   * Change the source URL of the ImageObject
   * @param {String} url - the new URL 
   */
  this.changeURL = function(url) {
    init(url);
  }

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

    if(this.opts.crop) {
      this.ctx.drawImage(this.imgElm, cropX, cropY, cropW, cropH, x, y, this.w, this.h);
    } else {
      this.ctx.drawImage(this.imgElm, x, y, this.w, this.h);      
    }
    this.ctx.restore();
  }
};
/**
 * Revert any changes made to the image
 */
PostcardImageObject.prototype.revert = function() {
  if(!this.opts.keepOriginal) throw new Error("original image wasn't preserved");
  this._ctx.putImageData(this.origImgData, 0, 0);
  this.imgElm.src = this._canvas.toDataURL();
};
/**
 * Get the original image data
 * @returns {ImageData|Error} 
 */
PostcardImageObject.prototype.getOriginalImageData = function() {
  if(this.imageloaded && this.opts.keepOriginal) {
    var origImgData = this._ctx.createImageData(this.origImgData.width, this.origImgData.height);
    origImgData.data.set(this.origImgData.data);
    return origImgData;
  }
  else throw new Error("image not loaded/not saving original");
};
/**
 * Get the current image data
 * @returns {ImageData|Error} 
 */
PostcardImageObject.prototype.getCurrentImageData = function() {
  if(this.imageloaded) return this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
  else throw new Error("image not loaded");
};
/**
 * Set the new image data
 * @param {ImageData} newImageData - new ImageData object to set
 */
PostcardImageObject.prototype.setImageData = function(newImageData) {
  this._ctx.putImageData(newImageData, 0, 0);
  this.imgElm.src = this._canvas.toDataURL();
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