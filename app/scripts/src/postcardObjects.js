'use strict';

/**
 * Represents an internal object within the Postcard. Can be selected, redrawn, modified.
 * @constructor
 * @param {text|image|shape} type - The type of object being rendered
 * @param {CanvasRenderingContext2D} ctx - context in which to draw the object
 * @param {Object} [options] - Defines placement and content. 
 */
function PostcardObject(type, ctx, options) {

  var defaults = {
    x: 0,
    y: 0,
    w: 50,
    h: 50,
    fill: "steelblue",
    selectable: false,
    zindex: 0,
    rotation: 0
  };

  this.ctx = ctx;
  this.type = type;
  this.opts = _extend( {}, defaults, options);  
  this.x = parseInt(this.opts.x, 10);                           /* for brevitys sake */
  this.y = parseInt(this.opts.y, 10);
  this.w = parseInt(this.opts.w, 10);
  this.h = parseInt(this.opts.h, 10);
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
  this.x = parseInt(this.opts.x, 10);                           /* for brevitys sake */
  this.y = parseInt(this.opts.y, 10);
  this.w = parseInt(this.opts.w, 10);
  this.h = parseInt(this.opts.h, 10);
};


PostcardImageObject.prototype = new PostcardObject();
PostcardImageObject.prototype.constructor = PostcardImageObject;
/**
 * Represents an internal object that deals with images
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
  this.cache = {};              // cache images so we don't have to keep proxy-ing them

  /***** internal canvas for ImageData manipulation *****/
  this._canvas = document.createElement('canvas');
  this._ctx = this._canvas.getContext('2d');

  var curr = this;

  /* initialize with the supplied url */
  if(url.length) loadImage(url);
  else throw new Error("empty URL string");

  /***** private methods *****/
  /**
   * Method to get image data via proxy. Uses the JSONP library to get the raw image data, then
   * adds it to the cache of images and makes a call to applyImage()
   * @private
   * @params {String} url - The URL of the image to load.
   */
  function loadImage(url) {

    var regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if(url) {
      var isSecure = location.protocol === "https:";
      var proxyURL = curr.proxyURL + "?callback=?";

      // If url specified and is a url + if server is secure when image or user page is
      if(proxyURL && regex_url_test.test(proxyURL) && !(isSecure && proxyURL.indexOf('http:') == 0)) {
        // do nothing, eventually do something?
      } else throw new Error('bad or insecure server url combination.');

      JSONP.get( proxyURL, { url: escape(url) }, function(rawData) {

        /* now that we know the URL is good, we'll set it to the object
         * we add it to the cache for later, then pass the new cached object to applyImage
         */
        curr.url = url;
        curr.cache[curr.url] = rawData;         
        applyImage(curr.cache[curr.url]);
      });
    }
  };
  /**
   * Takes raw image data (from the proxy or cache) and sets it to the ImageObject,
   * using an HTMLImageElement as a shell
   * test test test
   * @private
   * @params {Object} newImg - Contains width, height, and src of DataURI
   */
  function applyImage(newImg) {

      var newImgElm = new Image();
      newImgElm.onload = function () {

        curr._canvas.width = newImg.width;
        curr._canvas.height = newImg.height;
        curr.imgElm = this;

        // draws the image on the internal canvas so we can extract the ImageData from it 
        curr._ctx.drawImage(curr.imgElm, 0, 0, curr._canvas.width, curr._canvas.height); 

        // makes a copy of the ImageData object for reverting
        if(curr.opts.keepOriginal) {
          curr.origImgData = curr._ctx.getImageData(0, 0, curr._canvas.width, curr._canvas.height);
        }

        curr.imageloaded = true;

        // trigger a render of the postcard canvas  
        _triggerEvent(curr.ctx.canvas, "forcerender"); 

        // ensure that this only occurs at first load, and not for subsequent image.src changes
        this.onload = onImageRefresh;  
        
      };
      newImgElm.src = newImg.data;
  };

  /**
   * Happens whenever image.src changes
   * @private
   */
  function onImageRefresh() {
    console.log('imagerefresh');
    _triggerEvent(curr.ctx.canvas, "forcerender"); 
  };

  /***** privileged methods *****/
  /**
   * Change the source URL of the ImageObject
   * @param {String} newUrl - the new URL 
   */
  this.changeURL = function(newUrl) {
    this.imageloaded = false;
    if(newUrl in this.cache) applyImage(this.cache[newUrl]);
    else loadImage(newUrl);
  }
};
/***** public methods *****/
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


PostcardTextObject.prototype = new PostcardObject();
PostcardTextObject.prototype.constructor = PostcardTextObject;
/**
 * Represents an internal object that deals with images
 * @constructor
 * @extends PostcardObject
 * @param {String} text - actual text value
 * @param {CanvasRenderingContext2D} ctx - context in which to draw the object 
 * @param {Object} [options] - Defines placement and content.  
 */
function PostcardTextObject(text, ctx, options) {

  var textDefaults = {
    fill: "#ffffff",
    style: "normal",
    weight: "normal",
    size: "16px",
    family: "sans-serif",
    fontString: "",
    centered: false,
  };
  this.opts = _extend( {}, textDefaults, options); 
  PostcardObject.apply(this, ["text", ctx, this.opts]);

  this.text = text;
  var curr = this;

  /***** internal canvas for manipulation *****/
  this._canvas = document.createElement('canvas');
  this._ctx = this._canvas.getContext('2d');

  var measureText = function() {
    curr._ctx.font = curr.getFont();
    curr.w = curr._ctx.measureText(curr.text).width;    
    curr.h = parseInt(curr.opts.size, 10);    
  };

  //console.log("text: " + this.text + " w: " + this.w + " h: " + this.h);
  if(this.opts.fontString.length) this.setFont(this.opts.fontString);
  else measureText();
};
/**
 * Draw method for the text object
 */
PostcardTextObject.prototype.draw = function() {

  this.ctx.save();             
  this.ctx.fillStyle = this.opts.fill; 
  this.ctx.font = this.getFont(); 
  this.ctx.fillText(this.text, this.x, this.y);
  this.ctx.restore();
};
/**
 * Contains method for ImageObject. Necessary because y starts at the bottom left
 * @returns {Boolean} if the coordinate is within the object's bounds
 */
PostcardTextObject.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y >= my) && (this.y - this.h <= my);
          //(this.y >= my) && (this.y + this.h <= my);
};
/**
 * Update the TextObject with a new text value
 * @param {String} newText - the new text
 */
PostcardTextObject.prototype.changeText = function(newText) {
  this.text = newText;
  this.w = this._ctx.measureText(this.text).width;
  _triggerEvent(this.ctx.canvas, "forcerender");
};
/**
 * Formats the font options into the string thats recognized by ctx.font
 * Format: "style weight size family"
 */
PostcardTextObject.prototype.getFont = function() {
  return this.opts.style + ' ' 
          + 'normal '
          + this.opts.weight + ' ' 
          + this.opts.size + ' '
          + this.opts.family;
};
/**
 * Allows for styling to be set via string, a la CSS
 * NOTE: relies on "px" being part of the font size declaration
 * Format: "hex style weight size family"
 */
PostcardTextObject.prototype.setFont = function (fontString) {

    //format : "hex style weight size family"
    //relies on "px" being part of the font size declaration

    var pieces = fontString.split(' ', 4),
        family = fontString.slice(fontString.indexOf('px') + 3);
    this.opts.fill = pieces[0];
    this.opts.style = pieces[1];
    this.opts.weight = pieces[2];
    this.opts.size = pieces[3];
    this.opts.family = family;
    this._ctx.font = this.getFont();
    this.w = this._ctx.measureText(this.text).width;    
    this.h = parseInt(this.opts.size, 10); 
    _triggerEvent(this.ctx.canvas, "forcerender");
};


