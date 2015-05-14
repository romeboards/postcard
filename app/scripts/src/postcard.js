'use strict';

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
  this.dragoffx = 0;          // See mousedown and mousemove events for explanation
  this.dragoffy = 0;  
  var currentState = this;            /* closure for events and rendering loop */

  /***** set proxy url for image objects and initialize JSONP *****/
  PostcardImageObject.prototype.proxyURL = this.opts.proxyURL;
  JSONP.init({
    error: function(ex){ console.error("Failed to load : " + ex.url); }
  });  

  /***** rendering stack *****/
  this.renderingStack = new OrderedMap();

  /***** main rendering loop *****/
  setInterval(function() { currentState.render(); }, currentState.opts.renderInterval);

  /***** events *****/
  this.elm.addEventListener("forcerender", function(e) {
    currentState.valid = false;
  });
  //fixes a problem where double clicking causes text to get selected on the canvas
  this.elm.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  this.elm.addEventListener('mousedown', function(e) {

    var mouse = getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var topZindex = 0; // keeps track of the highest z-index found so far
    var tempSelection = null;


    console.log("mouse: " + mx + " " + my);

    currentState.renderingStack.forEach(function(key, zindex, object) {
      if(object.contains(mx,my) && zindex >= topZindex) { // if a hit is detected and its at the top (so far)
        tempSelection = object;
      }      
    });

    if(tempSelection) {
      currentState.dragoffx = mx - tempSelection.x;
      currentState.dragoffy = my - tempSelection.y;
      currentState.dragging = true;
      currentState.selection = tempSelection;
      currentState.valid = false;
      return;
    }

    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (currentState.selection) {
      currentState.selection = null;
      currentState.valid = false; // Need to clear the old selection border
    }
  }, false);

  this.elm.addEventListener('mousemove', function(e) {
    if (currentState.dragging){
      var mouse = getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      currentState.selection.x = mouse.x - currentState.dragoffx;
      currentState.selection.y = mouse.y - currentState.dragoffy;   
      currentState.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  this.elm.addEventListener('mouseup', function(e) {
    currentState.dragging = false;
  }, true);
  // // double click for making new shapes
  // this.elm.addEventListener('dblclick', function(e) {
  //   var mouse = getMouse(e);
  //   //myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  // }, true);



  /***** private methods *****/
  /**
   * Gets accurate mouse coordinates
   * @private
   * @param {Event} e - the click event
   */ 
  var getMouse = function(e) {
    var element = currentState.elm, offsetX = 0, offsetY = 0, mx, my;
    
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += currentState.stylePaddingLeft + currentState.styleBorderLeft + currentState.htmlLeft;
    offsetY += currentState.stylePaddingTop + currentState.styleBorderTop + currentState.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  };
  /**
   * Clears the canvas before rerendering.
   */
  var clear = function() {
    currentState.ctx.clearRect(0, 0, currentState.width, currentState.height);
  };    

  /***** privileged methods *****/

  /**
   * Main rendering loop for the Postcard
   */
  this.render = function() {
    if(!this.valid) { 

      clear();

      // this should iterate through the rendering stack
      this.renderingStack.forEach(function (key, zindex, object) {
        //console.log("[" + key + "] at: " + zindex);
        object.draw();
      });

      // draw selection
      // right now this is just a stroke along the edge of the selected Shape
      if (this.selection != null) {
        this.ctx.strokeStyle = '#CC0000';
        this.ctx.lineWidth = '2';
        var s = this.selection;
        this.ctx.strokeRect(s.x, s.y, s.w, s.h);
      }

      this.valid = true;
    }
  };

} /* end of Postcard() */

/***** public methods *****/
/**
* Get an object on the postcard with its ID
* @param {String} id - Unique identifier for the object
* @returns {PostcardObject|Error} - The object in question or an Error if not found
*/
Postcard.prototype.get = function(id) {
  return this.renderingStack.get(id);
}
/**
* Get the current selection on the postcard, if there is one
* @returns {PostcardObject|null} - The object in question or null
*/
Postcard.prototype.getSelection = function() {
  return this.selection;
}
/**
 * Add a generic object (shape)
 * @param {String} id - Unique identifier for the object
 * @param {Number} [zindex] - Z-index for the object. Defaults to 0
 * @param {Object} [options] - Defines placement and content. See PostcardObject contructor
 */
Postcard.prototype.addObject = function(id, zindex, options) {

  var _id = id, _zindex = 0, _options = {};

  if(arguments.length > 2) {
    _zindex = arguments[1];
    _options = arguments[2];
  } else if(arguments.length == 2) {
    if (typeof arguments[1] == "number") _zindex = arguments[1];
    else _options = arguments[1];
  } 

  console.log("adding: " + _id + " at z-index: " + _zindex + " with options: ", _options);

  var newObject = new PostcardObject("shape", this.ctx, _options);
  this.renderingStack.add(_id, _zindex, newObject);
};
/**
 * Add an image
 * @param {String} id - Unique identifier for the object
 * @param {Srting} url - URL to the image
 * @param {Number} [zindex] - Z-index for the object. Defaults to 0
 * @param {Object} [options] - Defines placement and content. See PostcardObject contructor
 */
Postcard.prototype.addImage = function(id, url, zindex, options) {

  var _id = id, _url = url,
      _zindex = 0, _options = {};

  if (typeof arguments[1] !== "string") {
    throw new Error("no url specified? id: " + _id);
  }

  if(arguments.length > 3) {
    _zindex = arguments[2];
    _options = arguments[3];
  } else if(arguments.length === 3) {
    if (typeof arguments[2] == "number") _zindex = arguments[2];
    else _options = arguments[2];
  } 

  console.log("adding: " + _id + " at z-index: " + _zindex + " with options: ", _options);

  var newImageObject = new PostcardImageObject(_url, this.ctx, _options);
  this.renderingStack.add(_id, _zindex, newImageObject);
};

/** 
 * Export the Postcard and trigger a save prompt
 * @param {Event} event - The click event
 */
Postcard.prototype.save = function(event) { 

  // var data = this.element.toDataURL("image/png");
  // data = data.substr(data.indexOf(',') + 1).toString();
  // var dataInput = document.createElement("input") ;
  // dataInput.setAttribute("name", 'imgdata') ;
  // dataInput.setAttribute("value", data);

  // var nameInput = document.createElement("input") ;
  // nameInput.setAttribute("name", 'name') ;
  // nameInput.setAttribute("value",this.options.filename + '.png');

  // var myForm = document.createElement("form");
  // myForm.method = 'post';
  // myForm.action = this.options.saveURL;
  // myForm.appendChild(dataInput);
  // myForm.appendChild(nameInput);

  // document.body.appendChild(myForm);
  // myForm.submit();
  // document.body.removeChild(myForm);

  //browsers that don't support the download attribute
  //best we can do is give them a nice message
  if(this.browser.isSafari || this.browser.isIE) {
    alert('opening a new tab, just gotta [right click > save] the image. not ideal.');
    event.target.setAttribute('target', '_blank');
  }
  event.target.href = this.elm.toDataURL();
  event.target.download = this.opts.filename;
}
