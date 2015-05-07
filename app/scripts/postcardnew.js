'use strict';

/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */
var Base64Binary={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decodeArrayBuffer:function(e){var t=e.length/4*3;var n=new ArrayBuffer(t);this.decode(e,n);return n},decode:function(e,t){var n=this._keyStr.indexOf(e.charAt(e.length-1));var r=this._keyStr.indexOf(e.charAt(e.length-2));var i=e.length/4*3;if(n==64)i--;if(r==64)i--;var s;var o,u,a;var f,l,c,h;var p=0;var d=0;if(t)s=new Uint8Array(t);else s=new Uint8Array(i);e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");for(p=0;p<i;p+=3){f=this._keyStr.indexOf(e.charAt(d++));l=this._keyStr.indexOf(e.charAt(d++));c=this._keyStr.indexOf(e.charAt(d++));h=this._keyStr.indexOf(e.charAt(d++));o=f<<2|l>>4;u=(l&15)<<4|c>>2;a=(c&3)<<6|h;s[p]=o;if(c!=64)s[p+1]=u;if(h!=64)s[p+2]=a}return s}}

/*
* Lightweight JSONP fetcher
* Copyright 2010-2012 Erik Karlsson. All rights reserved.
* BSD licensed
*/


/*
* Usage:
* 
* JSONP.get( 'someUrl.php', {param1:'123', param2:'456'}, function(data){
*   //do something with data, which is the JSON object you should retrieve from someUrl.php
* });
*/
var JSONP = (function(){
    var counter = 0, head, window = this, config = {};
    function load(url, pfnError) {
        var script = document.createElement('script'),
            done = false;
        script.src = url;
        script.async = true;
 
        var errorHandler = pfnError || config.error;
        if ( typeof errorHandler === 'function' ) {
            script.onerror = function(ex){
                errorHandler({url: url, event: ex});
            };
        }

        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if ( script && script.parentNode ) {
                    script.parentNode.removeChild( script );
                }
            }
        };

        if ( !head ) {
            head = document.getElementsByTagName('head')[0];
        }
        head.appendChild( script );
    }
    function encode(str) {
        return encodeURIComponent(str);
    }
    function jsonp(url, params, callback, callbackName) {
        var query = (url||'').indexOf('?') === -1 ? '?' : '&', key;

        callbackName = (callbackName||config['callbackName']||'callback');
        var uniqueName = callbackName + "_json" + (++counter);

        params = params || {};
        for ( key in params ) {
            if ( params.hasOwnProperty(key) ) {
                query += encode(key) + "=" + encode(params[key]) + "&";
            }
        }   

        window[ uniqueName ] = function(data){
            callback(data);
            try {
                delete window[ uniqueName ];
            } catch (e) {}
            window[ uniqueName ] = null;
        };
 
        load(url + query + callbackName + '=' + uniqueName);
        return uniqueName;
    }
    function setDefaults(obj){
        config = obj;
    }
    return {
        get:jsonp,
        init:setDefaults
    };
}());

function _testCSS(prop) {
    return prop in document.documentElement.style;
}

function _triggerEvent(el, name) {
    if (window.CustomEvent) {
        var event = new CustomEvent(name);
    } else {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, true);
    }
    el.dispatchEvent(event);
}

function _extend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
}

if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
    XMLHttpRequest.prototype.sendAsBinary = function(string) {
        var bytes = Array.prototype.map.call(string, function(c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
}

var SERVER_URL = "http://lab.layerframe.com/postcard/scripts/";

/**
 * Arraylike structure that preserves order while maintaining fast lookup by key. 
 * The order of the array is detirmined by a sorted array of z-indicies, which are *positive* integers including 0. 
 * Used for the Postcard rendering stack.
 * @constructor
 */
function OrderedMap() {

  this.map = {};

  /* the two internal arrays should always represent objects in the same order 
   * i.e. _karray[i] should ALWAYS be the same object as _zarray[i]
   */
  this._karray = [];      /* stores an array of keys */
  this._zarray = [];      /* stores an array of zindices */
}
/**
 * Asserts that key exists in the OrderedMap
 * @param {String} key
 * @returns {Error} if not found
 */
OrderedMap.prototype.assert = function(key) {
  if(!(key in this.map)) throw new Error('key does not exist');
};
/**
 * Number of objects in the OrderedMap
 * @returns {Number|Error} Length of the OrderedMap or Error if there's an unresolved issue.
 */
OrderedMap.prototype.length = function() {
  //if(this.map.length != this._karray.length || this.map.length != this._zarray.length) throw new Error('mismatched internals');
  return this._karray.length;
};
/**
 * Traverses the sorted z-index array and find the index where the new z-index value should be inserted.
 * @param {Number} zindex - The new z-index value to search with
 * @returns {Number}
 */
OrderedMap.prototype.findFirst = function(zindex) {

  /* we could do a binary search here, but lets keep it simple for now
   * search a sorted array and return the index at which to place the new value (zindex)
   */
  var i = 0;
  for(i; i < this._zarray.length; i++) {
    if(this._zarray[i] > zindex) return i;
  }
  return i;
};
/**
 * Adds a new object to the OrderedMap. If the key already exists, an Error is thrown.
 * @param {String} key - The unique identifier that can get/set the object 
 * @param {Number} zindex - The new z-index value to search with
 * @param value - Whatever needs to be stored.
 */
OrderedMap.prototype.add = function(key, zindex, value) { 
  if(!this.exists(key)) {
    if(zindex < 0) throw new Error('z-index can\'t be less than 0');
    var idx = this.findFirst(zindex);
    this._karray.splice(idx, 0, key);
    this._zarray.splice(idx, 0, zindex);
    this.map[key] = value;
  } else {
    throw new Error('key already exists');
  }
};
/**
 * Remove a object from the OrderedMap
 * @param {String} key
 */
OrderedMap.prototype.remove = function(key) {
  this.assert(key);
  var idx = this._karray.indexOf(key);
  this._karray.splice(idx, 1);
  this._zarray.splice(idx, 1);
  delete this.map[key];
};
/**
 * Asserts that key exists in the OrderedMap
 * @param {String} key
 * @returns {Boolean}
 */
OrderedMap.prototype.exists = function(key) {
  if(key in this.map) return true;
  return false;
};
/**
 * Get a object from the OrderedMap
 * @param {String} key
 * @returns The value stored or a new Error if the key does not exist
 */
OrderedMap.prototype.get = function(key) {
  this.assert(key);
  return this.map[key];
};
/**
 * Get a object's z-index from the OrderedMap
 * @param {String} key
 * @returns {Number|Error} The z-index or a new Error if the key does not exist
 */
OrderedMap.prototype.getZindex = function(key) {
  this.assert(key);
  var idx = this._karray.indexOf(key);
  return this._zarray[idx];
};
/**
 * Update the value of an object in the OrderedMap
 * @param {String} key
 * @param value - The new value 
 */
OrderedMap.prototype.updateValue = function(key, value) {
  this.assert(key);
  this.map[key] = value;
};
/**
 * Change the order of an object in the OrderedMap
 * @param {String} key
 * @param {Number} zindex 
 * @returns a new Error if the key does not exist or if the new z-index is < 0
 */
OrderedMap.prototype.changeOrder = function(key, zindex) {
  if(zindex < 0) throw new Error('z-index can\'t be less than 0');
  var value = this.get(key);
  this.remove(key);
  this.add(key, zindex, value);
};
/**
 * Bring an object to the start of the OrderMap, i.e. set the z-index to 0.
 * It will still appear after other objects which also have a z-index of 0, however.
 * [TODO] modify this functionality so it is guaranteed to be at the first index? 
 * @param {String} key
 * @returns a new Error if the key does not exist
 */
OrderedMap.prototype.toStart = function(key) {
  this.changeOrder(key,0);
};
/**
 * Bring an object to the end of the OrderMap. 
 * Its new z-index will be the same as the greatest z-index currently in the OrderedMap, appearing after that object.
 * @param {String} key
 * @returns a new Error if the key does not exist
 */
OrderedMap.prototype.toEnd = function(key) {
  var last = this._zarray[this._zarray.length-1];
  this.changeOrder(key,last);
};
/**
 * Traverse through the OrderedMap, starting from lowest z-index to highest z-index. 
 * @param {objectCallback} f - The callback for each individual object.
 */
OrderedMap.prototype.forEach = function(f) {
  var key, value, zindex;
  for(var i = 0; i < this._karray.length; i++) {
      key = this._karray[i];
      zindex = this._zarray[i];
      value = this.map[key];

      /**
       * This is called for each object in the OrderedMap.
       * @callback OrderedMap~objectCallback
       * @param {String} key - The key of the object
       * @param {Number} zindex - The z-index of the object
       * @param value - The value of the object
       */    
      f(key, zindex, value);
  }
};

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
    zindex: 0
  };

  this.ctx = ctx;
  this.type = type;
  this.opts = _extend( {}, defaults, options);  
  this.x = this.opts.x;                           /* for brevitys sake */
  this.y = this.opts.y;
  this.w = this.opts.w;
  this.h = this.opts.h;
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
  this.drawn = false;           // used for triggering the canvas to draw 
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
PostcardImageObject.prototype.draw = function(ctx) {
  if(this.imageloaded) {
    ctx.drawImage(this.imgData, this.x, this.y, this.w, this.h); // Or at whatever offset you like 
  }
};


/**
 * Represents a new Postcard instance
 * @constructor
 * @param {HTMLCanvasElement} element - The Canvas element to render.
 * @param {Object} options - Any options to overwrite the defaults.
 */
function Postcard( element, options ) {

  /***** base variables *****/
  var defaults = {
    height: "",
    width: "",
    proxyURL: SERVER_URL + "image_proxy.php",
    filename: "yourpostcard.png",
    renderInterval: "30",
    backgroundImgUrl: "",
    backgroundColor: "#fff",
    fontFamily: "sans-serif",
    fontSize: "16px",
    fontColor: "#fff",
    fontStyle: "normal",
    fontWeight: "normal",
    lineColor: "#ff0000",
    lineWeight: "5"
  },
  browser = { isOpera : false, isFirefox : false, isSafari : false, isChrome : false, isIE : false };

  /***** init *****/
  this.elm = element;
  this.opts = _extend( {}, defaults, options);    
  this.height = this.opts.height = this.elm.height;
  this.width = this.opts.width = this.elm.width;
  this.ctx = this.elm.getContext("2d");

  /***** browser details *****/
  this.browser = browser;
  this.browser.isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
  this.browser.isFirefox = _testCSS('MozBoxSizing');                 // FF 0.8+
  this.browser.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  this.browser.isChrome = !this.browser.isSafari && _testCSS('WebkitTransform');  // Chrome 1+
  this.browser.isIE = /*@cc_on!@*/false || _testCSS('msTransform');  // At least IE6 

  /***** coordinate fixing *****/
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.elm, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(this.elm, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(this.elm, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(this.elm, null)['borderTopWidth'], 10)   || 0;
  }
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  /***** state variables *****/
  this.valid = false;         /* applies only if canvas has been changed in some way, prevents from pointless redrawing */
  this.dragging = false;      /* keeps track of when an element on the canvas is being dragged */
  this.selection = null;      /* current selection - pointer to the PostcardObject */
  var currentState = this;            /* closure for events and rendering loop */

  /***** rendering stack *****/
  this.renderingStack = new OrderedMap();

  /***** main rendering loop *****/
  setInterval(function() { currentState.render(); }, currentState.opts.renderInterval);

  /***** events *****/
  this.elm.addEventListener("forcerender", function(e) {
    currentState.forceRender();
  });

  /***** private methods *****/
  /**
   * Gets accurate mouse coordinates
   * @private
   * @param {Event} e - the click event
   */ 
  var getMouse = function(e) {
    var element = this.elm, offsetX = 0, offsetY = 0, mx, my;
    
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  };

  /***** privileged methods *****/
  /**
   * Main rendering loop for the Postcard
   */
  this.render = function() {

    if(!this.valid) { 

      // this should iterate through the rendering stack
      this.renderingStack.forEach(function (key, zindex, object) {
        console.log("[" + key + "] at: " + zindex);
        object.draw(currentState.ctx);
      });

      //console.log('dragging', this.dragging);

      this.valid = true;
    }
  };

} /* end of Postcard() */

/***** public methods *****/
/**
 * Triggers a fresh rendering.
 * [TODO] is this necessary?
 */
Postcard.prototype.forceRender = function() {
  this.valid = false;
};
/**
 * Add a generic object (shape)
 * @param {String} key - Unique identifier for the object
 * @param {Number} [zindex] - Z-index for the object. Defaults to 0
 * @param {Object} [options] - Defines placement and content. See PostcardObject contructor
 */
Postcard.prototype.addObject = function(key, zindex, options) {

  var _key = key, _zindex = 0, _options = {};

  if(arguments.length > 2) {
    _zindex = arguments[1];
    _options = arguments[2];
  } else if(arguments.length == 2) {
    if (typeof arguments[1] == "number") _zindex = arguments[1];
    else _options = arguments[1];
  } 

  console.log("adding: " + _key + " at z-index: " + _zindex + " with options: ", _options);

  var newObject = new PostcardObject("shape", this.ctx, _options);
  this.renderingStack.add(_key, _zindex, newObject);
};
/**
 * Add an image
 * @param {String} key - Unique identifier for the object
 * @param {Srting} url - URL to the image
 * @param {Number} [zindex] - Z-index for the object. Defaults to 0
 * @param {Object} [options] - Defines placement and content. See PostcardObject contructor
 */
Postcard.prototype.addImage = function(key, url, zindex, options) {

  var _key = key, _url = url,
      _zindex = 0, _options = {};

  if (typeof arguments[1] !== "string") {
    throw new Error("no url specified? key: " + _key);
  }

  if(arguments.length > 3) {
    _zindex = arguments[2];
    _options = arguments[3];
  } else if(arguments.length === 3) {
    if (typeof arguments[2] == "number") _zindex = arguments[2];
    else _options = arguments[2];
  } 

  console.log("adding: " + _key + " at z-index: " + _zindex + " with options: ", _options);

  var newImageObject = new PostcardImageObject(_url, this.ctx, _options);
  this.renderingStack.add(_key, _zindex, newImageObject);
};


