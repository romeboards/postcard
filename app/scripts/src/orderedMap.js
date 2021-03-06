'use strict';

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
  if(!(key in this.map)) throw new Error('key: "' + key + '" does not exist');
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
  var value = this.get(key);
  this.remove(key);
  this._karray.splice(0, 0, key);
  this._zarray.splice(0, 0, 0);
  this.map[key] = value;  
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
 * @param {objectCallback} callback - The callback function for each individual object.
 */
OrderedMap.prototype.forEach = function(callback) {
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
      callback(key, zindex, value);
  }
};
/**
 * Creates an array with all elements that pass the test implemented by the provided function.
 * [TODO] Implement thisArg instead of apply-ing with null
 * @param {Function} callback - Function to test each element of the OrderedMap. Invoked with arguments (key, zindex, value). Return true to keep the object, false otherwise.
 */
OrderedMap.prototype.filter = function(callback) {
  var res = [];
  this.forEach(function (key, zindex, value) {
    if(callback.apply(null, [key, zindex, value])) {
      res.push(value);
    }
  });
  return res;
};
