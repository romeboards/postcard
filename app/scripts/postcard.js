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
 *
 *  jQuery $.getImageData Plugin 0.3
 *  http://www.maxnov.com/getimagedata
 *
 *  Written by Max Novakovic (http://www.maxnov.com/)
 *  Date: Thu Jan 13 2011
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  Includes jQuery JSONP Core Plugin 2.4.0 (2012-08-21)
 *  https://github.com/jaubourg/jquery-jsonp
 *  Copyright 2012, Julian Aubourg
 *  Released under the MIT License.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  Copyright 2011, Max Novakovic
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://www.maxnov.com/getimagedata/#license
 *
 */
;// jQuery JSONP
(function(d){function U(){}function V(a){r=[a]}function e(a,d,e){return a&&a.apply(d.context||d,e)}function g(a){function g(b){l++||(m(),n&&(t[c]={s:[b]}),A&&(b=A.apply(a,[b])),e(u,a,[b,B,a]),e(C,a,[a,B]))}function s(b){l++||(m(),n&&b!=D&&(t[c]=b),e(v,a,[a,b]),e(C,a,[a,b]))}a=d.extend({},E,a);var u=a.success,v=a.error,C=a.complete,A=a.dataFilter,p=a.callbackParameter,F=a.callback,W=a.cache,n=a.pageCache,G=a.charset,c=a.url,f=a.data,H=a.timeout,q,l=0,m=U,b,h,w;I&&I(function(a){a.done(u).fail(v);u=
a.resolve;v=a.reject}).promise(a);a.abort=function(){!l++&&m()};if(!1===e(a.beforeSend,a,[a])||l)return a;c=c||x;f=f?"string"==typeof f?f:d.param(f,a.traditional):x;c+=f?(/\?/.test(c)?"&":"?")+f:x;p&&(c+=(/\?/.test(c)?"&":"?")+encodeURIComponent(p)+"=?");W||n||(c+=(/\?/.test(c)?"&":"?")+"_"+(new Date).getTime()+"=");c=c.replace(/=\?(&|$)/,"="+F+"$1");n&&(q=t[c])?q.s?g(q.s[0]):s(q):(J[F]=V,b=d(K)[0],b.id=L+X++,G&&(b[Y]=G),M&&11.6>M.version()?(h=d(K)[0]).text="document.getElementById('"+b.id+"')."+
y+"()":b[N]=N,Z&&(b.htmlFor=b.id,b.event=z),b[O]=b[y]=b[P]=function(a){if(!b[Q]||!/i/.test(b[Q])){try{b[z]&&b[z]()}catch(c){}a=r;r=0;a?g(a[0]):s(R)}},b.src=c,m=function(a){w&&clearTimeout(w);b[P]=b[O]=b[y]=null;k[S](b);h&&k[S](h)},k[T](b,p=k.firstChild),h&&k[T](h,p),w=0<H&&setTimeout(function(){s(D)},H));return a}var N="async",Y="charset",x="",R="error",T="insertBefore",L="_jqjsp",z="onclick",y="on"+R,O="onload",P="onreadystatechange",Q="readyState",S="removeChild",K="<script>",B="success",D="timeout",
J=window,I=d.Deferred,k=d("head")[0]||document.documentElement,t={},X=0,r,E={callback:L,url:location.href},M=J.opera,Z=!!d("<div>").html("\x3c!--[if IE]><i><![endif]--\x3e").find("i").length;g.setup=function(a){d.extend(E,a)};d.jsonp=g})(jQuery);

(function( $ ){

    // jQuery getImageData Plugin
    $.getImageData = function(args) {
    
        var regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    
        // If a URL has been specified
        if(args.url) {
        
            // Ensure no problems when using http or http
            var is_secure = location.protocol === "https:";
            var server_url = "";
        
            // If url specified and is a url + if server is secure when image or user page is
            if(args.server && regex_url_test.test(args.server) && !(is_secure && args.server.indexOf('http:') == 0)) {
                server_url = args.server;
            } else server_url = "//img-to-json.appspot.com/";
        
            server_url += "?callback=?";
        
            //console.log("server url: " + server_url);

            // Using jquery-jsonp (http://code.google.com/p/jquery-jsonp/) for the request
            // so that errors can be handled
            $.jsonp({   
                url: server_url,
                data: { url: escape(args.url) },
                dataType: 'jsonp',
                timeout: args.timeout || 30000,
                // It worked!
                success: function(data, status) {
            
                    // Create new, empty image
                    var return_image = new Image();
                
                    // When the image has loaded
                    $(return_image).load(function(){
                    
                        // Set image dimensions
                        this.width = data.width;
                        this.height = data.height;
                    
                        // Return the image
                        if(typeof(args.success) == typeof(Function)) {
                            args.success(this);
                        }
                    
                    // Put the base64 encoded image into the src to start the load
                    }).attr('src', data.data);
                
              },
                // Something went wrong.. 
                error: function(xhr, text_status){
                    // Return the error(s)
                    if(typeof(args.error) == typeof(Function)) {
                        args.error(xhr, text_status);
                    }
                }
            });
        
        // No URL specified so error
        } else {
            if(typeof(args.error) == typeof(Function)) {
                args.error(null, "no_url");
            }
        }
    };

})(jQuery);


function testCSS(prop) {
    return prop in document.documentElement.style;
}

/*

	BEGIN DAMN Plugin

*/

/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // Create the defaults once
        var defaults = {
            height: "",
            width: "",
            proxyURL: "http://lab.layerframe.com/postcard/scripts/image_proxy.php",
            saveURL: "http://lab.layerframe.com/postcard/scripts/save_file.php",
            filename: "yourpostcard.png",
            backgroundImgUrl: "../images/test.jpg",
            backgroundColor: "#30414C",
            fontFamily: "sans-serif",
            fontSize: "16px",
            fontColor: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        browser = { isOpera : false, isFirefox : false, isSafari : false, isChrome : false, isIE : false },
        pub = {
            init : function(options) {
                this.element = this[0];
                this.options = $.extend( {}, defaults, options);
                this.browser = browser;
                this.browser.isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
                this.browser.isFirefox = testCSS('MozBoxSizing');                 // FF 0.8+
                this.browser.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
                this.browser.isChrome = !this.browser.isSafari && testCSS('WebkitTransform');  // Chrome 1+
                this.browser.isIE = /*@cc_on!@*/false || testCSS('msTransform');  // At least IE6
                this._height = this.options.height = this.element.height;
                this._width = this.options.width = this.element.width;
                this._ctx = this.element.getContext("2d");

                this._images = [];
                //add background image
                if(this.options.backgroundImgUrl.length) {
                    pub.addImage.apply(this,  [ this.options.backgroundImgUrl, 0, 0, this._width, this._height ]);
                }
                pub.draw.apply(this);
            },
            draw : function() {  

                //draw background
                //console.log('bg');
                //console.log(this._width);
                this._ctx.rect(0,0,this._width, this._height);
                this._ctx.fillStyle = this.options.backgroundColor;
                this._ctx.fill();

                //pri.drawImages.apply(this);
            },
            addImage : function (url, x, y, w, h) {

                    //create internal image object
                    //push to _images to maintain order
                    //make call to proxy to fill in the data, using index in _images

                    var newimg = {
                        url : url,
                        x : x,
                        y: y,
                        w : w,
                        h : h,
                        loaded : false
                    };
                    this._images.push(newimg);
                    var newindex = this._images.length-1;
                    console.log(newindex + ' added');
                    //async call, will change 'loaded' to true when it feels like it
                    pri.getImage.apply(this, [newindex]);                    
            },
            addImages : function (obj) {

                // no guarantee to the order that the images get painted on!

                var images = obj.images;
                for(var i = 0; i < images.length; i++) {
                    pub.addImage.apply(this, [images[i].url, images[i].x, images[i].y, images[i].w, images[i].h]);
                }
            },
            setFont : function (font) {

                //format : "hex style weight size family"
                //relies on "px" being part of the font size declaration
                var pieces = font.split(' ', 4),
                    family = font.slice(font.indexOf('px') + 3);
                this.options.fontColor = pieces[0];
                this.options.fontStyle = pieces[1];
                this.options.fontWeight = pieces[2];
                this.options.fontSize = pieces[3];
                this.options.fontFamily = family;
            },
            setFontFamily : function (family) {
                this.options.fontFamily = family;
            },
            setFontStyle : function (style) {
                this.options.fontStyle = style;      
            },
            setFontWeight : function (weight) {
                this.options.fontWeight = weight;
            },
            setFontSize : function (size) {
                this.options.fontSize = size;
            },
            setFontColor : function (color) {
                this.options.fontColor = color;        
            },
            addText : function (text, x, y) {
                pri.setFont.apply(this);
                this._ctx.fillText(text,x,y);
            },
            addFullText : function (text, style, x, y) {
                pub.setFont.apply(this, [style]);
                pub.addText.apply(this, [text, x, y]);
            },
            save : function(event) { 

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

                //console.log(event.target);
                if(this.browser.isSafari || this.browser.isIE) {
                    alert('danger! danger!');
                    event.target.setAttribute('target', '_blank');
                }
                event.target.href = this.element.toDataURL();
                event.target.download = this.options.filename;


            },// GOOD
            update : function( content, values ) { 
                console.log(content);
                console.log(values.foo);
            }// !!!
        },
        pri = {
            getImage : function (i) {                                               //i corressponds to the index of the new image in _images  
                var that = this,
                    newimg = that._images[i],
                    ctx = that._ctx;

                $.getImageData({
                    url: newimg.url,
                    server: this.options.proxyURL,
                    success: function(data){
                        newimg.data = data;
                        newimg.loaded = true;
                        ctx.drawImage(newimg.data,newimg.x,newimg.y,newimg.w,newimg.h);
                        console.log(i + ' painted: ' + newimg.url);
                        pri.allImagesLoaded.apply(that);
                    },
                    error: function(xhr, text_status) { $(that.element).trigger('postcardimageerror', text_status); }
                }); 
            },
            allImagesLoaded : function () {
                for(var i = 0; i < this._images.length; i++) {
                    var img = this._images[i];
                    if(!img.loaded) return;
                    else if(i == this._images.length-1 && img.loaded) $(this.element).trigger('postcardimagesloaded');
                }                
            },
            drawImages : function () {

                //iterate through _images, and used cached data or WAIT

                //keep calling recursively till its done?????? this scares me

                for(var i = 0; i < this._images.length; i++) {



                }

                // console.log('alldone?');
                // console.log(this._images);

                // var that = this,                                                    //needed cause $.each overwrites magical 'this'
                //     ctx = this._ctx;

                // $.each(this._images, function (i, img) {
                //     if(!img.loading) {
                //         pri.drawImages.apply(this);
                //         console.log('ideally waiting');

                //     } else {
                //         ctx.drawImage(img.data,img.x,img.y,img.w,img.h);
                //     }
                // });
            },
            setFont : function () {

                //the function that actually sets the font and fontcolor in the ctx
                //called only before writing text

                var newfont = this.options.fontStyle + ' ' 
                            + 'normal '
                            + this.options.fontWeight + ' ' 
                            + this.options.fontSize + ' '
                            + this.options.fontFamily;

                this._ctx.fillStyle = this.options.fontColor; 
                this._ctx.font = newfont;
            }
        };

        $.fn.postcard = function(methodOrOptions) {
            if ( pub[methodOrOptions] ) {
                return pub[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
                return pub.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  methodOrOptions + ' does not exist.' );
            }    
        };

})( jQuery, window, document );