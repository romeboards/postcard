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

if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
    XMLHttpRequest.prototype.sendAsBinary = function(string) {
        var bytes = Array.prototype.map.call(string, function(c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
}

/*

	POSTCARD.JS PLUGIN

*/
;(function ( $, window, document, undefined ) {
        
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced).

    var defaults = {
        height: "",
        width: "",
        proxyURL: "http://lab.layerframe.com/postcard/scripts/image_proxy.php",
        filename: "yourpostcard.png",
        backgroundImgUrl: "",
        backgroundColor: "#fff",
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

            this._text = [], this._images = [], this._oldtext = [], this._oldimages = [];
            //add background image
            if(this.options.backgroundImgUrl.length) {
                pub.addImage.apply(this,  [ this.options.backgroundImgUrl, 0, 0, this._width, this._height ]);
            }
            //draw background
            pri.drawInit.apply(this);
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

                $(this.element).trigger('postcardimagesloading');

                var newindex = this._images.length-1;
                var d = new Date();
                //console.log(d.getSeconds() + ': ' + newindex + ' added');

                //async call, will change 'loaded' to true when it feels like it
                pri.getImage.apply(this, [newindex]);                    
        },
        addImages : function (obj) {

            // no guarantee to the order that the images get painted on!

            //var images = obj.images;
            var images = obj;
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
        addText : function (text, x, y) {                           // uses only current style

            var newtext = {
                text : text,
                style : pri.getFont.apply(this),
                x : x,
                y : y
            };
            this._text.push(newtext);
            pri.setFontToCtx.apply(this);
            this._ctx.fillText(text,x,y);
        },
        addFullText : function (text, style, x, y) {                // sets a new style, then calls addText()   
            pub.setFont.apply(this, [style]);                       // only sets internal options...
            pub.addText.apply(this, [text, x, y]);                  // ...this sets the font to ctx
        },
        add : function (obj) {

            //send in a JSON layout, draw all pictures then draw all text
            var that = this;
            var newimages = [], newtext = [];
            for(var i = 0; i < obj.length; i++) {
                if(obj[i].url !== undefined) {                      // detects an image...
                    newimages.push(obj[i]);
                } else if(obj[i].text !== undefined) {              // ...or else detects text...
                    newtext.push(obj[i]);
                }
                else $.error('Parsing error: postcard.add()');      // ...or nothing at all, error
            }

            pub.addImages.apply(this, [newimages]);

            $(this.element).on('_loaded', function () {
                for(var i = 0; i < newtext.length; i++) {
                    var text = newtext[i];
                    pub.addFullText.apply(that, [text.text, text.style, text.x, text.y]);
                }
                $(this).off('_loaded');
            });

        },
        setBreakpoint : function (breakpoint, newwidth, json) {

            var that = this;
            var bigger = function () {
                    if($(window).outerWidth(true) > breakpoint) { 

                        console.log('bigger');
                        $(that.element).trigger('postcardresize');


                        that.element.width = that._width = that._oldwidth;
                        that._oldwidth = newwidth;

                        var oldobj = that._oldimages.concat(that._oldtext);
                        that._oldimages = that._images.slice(0);
                        that._oldtext = that._text.slice(0);

                        pri.clear.apply(that);

                        pub.add.apply(that, [oldobj]);

                        $(window).on('resize', smaller);
                        $(window).off('resize', bigger);
                    }                  
                },
                smaller = function () {
                    if($(window).outerWidth(true) <= breakpoint) { 

                        console.log('smaller');
                        $(that.element).trigger('postcardresize');

                        that._oldwidth = that._width;
                        that.element.width = that._width = newwidth;

                        that._oldimages = that._images.slice(0);                        // .slice(0) forces pass by value
                        console.log(that._oldimages);
                        that._oldtext = that._text.slice(0);

                        pri.clear.apply(that);

                        pub.add.apply(that, [json]);

                        $(window).on('resize', bigger);
                        $(window).off('resize', smaller);
                    }
                };
            $(window).on('resize', smaller);

            // $(window).on('resize', function () {
            //     if($(window).outerWidth(true) <= breakpoint) { 
            //         $(that.element).trigger('postcardresize');
            //         that.element.width = that._width = newwidth;
            //         pri.clear.apply(that);
            //         that.images = [];
            //         that.text = [];
            //         pub.add.apply(that, [json]);
            //         $(window).off('resize');
            //     }
            // });
            
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

            //browsers that don't support the download attribute
            //best we can do is give them a nice message
            if(this.browser.isSafari || this.browser.isIE) {
                alert('danger! danger!');
                event.target.setAttribute('target', '_blank');
            }
            event.target.href = this.element.toDataURL();
            event.target.download = this.options.filename;
        },
        shareOnFB : function(caption) {                                         // caption must ALWAYS be user input

            var that = this;
            var data = this.element.toDataURL("image/png");
            var filename = this.options.filename;
            var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
            var decodedPng = Base64Binary.decode(encodedPng);

            FB.getLoginStatus(function(response) {

                if (response.status == 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                    console.log('post?!?!?!');
               // console.log(caption);

                    pri.postImageToFacebook.apply(that, [accessToken, filename, "image/png", decodedPng, caption]);

                } else if (response.status == 'not_authorized') {
                    // logged in but not authorized
                    FB.login(function(response) {
                        pri.postImageToFacebook.apply(that, [response.authResponse.accessToken, filename, "image/png", decodedPng, caption]);
                    }, {scope: "publish_stream"});
                } else {
                    // not logged in, not authorized
                    FB.login(function(response)  { 
                        pri.postImageToFacebook.apply(that, [response.authResponse.accessToken, filename, "image/png", decodedPng, caption]);
                    }, {scope: "publish_stream"});
                }
            });
        }
    },
    pri = {
        drawInit : function () {

            //draw initial stuff, background color or image, anything sent in with the beginning

            this._ctx.rect(0,0,this._width, this._height);
            this._ctx.fillStyle = this.options.backgroundColor;
            this._ctx.fill();

        },
        getImage : function (i) {                                               // i corressponds to the index of the new image in _images  
            var that = this,
                ctx = that._ctx;

            if(this._images[i].imgdata === undefined) {             
                $.getImageData({
                    url: that._images[i].url,
                    server: this.options.proxyURL,
                    success: function(data) {
                        that._images[i].imgdata = data;
                        that._images[i].loaded = true;
                        ctx.drawImage(that._images[i].imgdata, that._images[i].x, that._images[i].y, that._images[i].w, that._images[i].h);
                        pri.allImagesLoaded.apply(that);
                    },
                    error: function(xhr, text_status) { $(that.element).trigger('postcardimageerror', text_status); }
                }); 
            } else {
               ctx.drawImage(that._images[i].imgdata, that._images[i].x, that._images[i].y, that._images[i].w, that._images[i].h);
               pri.allImagesLoaded.apply(that); 
            }
        },
        allImagesLoaded : function () {
            for(var i = 0; i < this._images.length; i++) {
                var img = this._images[i];
                if(!img.loaded) {
                    this.allImagesLoaded = false;
                    return;
                }
                else if(i == this._images.length-1 && img.loaded) {
                    this.allImagesLoaded = true;
                    $(this.element).trigger('_loaded');
                    $(this.element).trigger('postcardimagesloaded');
                }
            }                
        },
        getloaded : function () {
            return this.allImagesLoaded;
        },
        clear : function() {
            this._text.length = 0;
            this._images.length = 0;
            this._ctx.clearRect(0, 0, this._width, this._height);
        },
        setFontToCtx : function () {

            //the function that actually sets the font and fontcolor in the ctx
            //called only before writing text

            var newfont = this.options.fontStyle + ' ' 
                        + 'normal '
                        + this.options.fontWeight + ' ' 
                        + this.options.fontSize + ' '
                        + this.options.fontFamily;

            this._ctx.fillStyle = this.options.fontColor; 
            this._ctx.font = newfont;
        },
        getFont : function () {
            return  this.options.fontColor + ' ' 
                    + this.options.fontStyle + ' ' 
                    + this.options.fontWeight + ' ' 
                    + this.options.fontSize + ' '
                    + this.options.fontFamily;
        },
        postImageToFacebook : function ( authToken, filename, mimeType, imageData, message ) {
            // this is the multipart/form-data boundary we'll use
            var boundary = '----ThisIsTheBoundary1234567890';
            
            // let's encode our image file, which is contained in the var
            var formData = '--' + boundary + '\r\n'
            formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
            formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
            for ( var i = 0; i < imageData.length; ++i )
            {
                formData += String.fromCharCode( imageData[ i ] & 0xff );
            }
            formData += '\r\n';
            formData += '--' + boundary + '\r\n';
            formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
            formData += message + '\r\n'
            formData += '--' + boundary + '--\r\n';
            
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
            xhr.onload = xhr.onerror = function() {
                console.log( xhr.responseText );
            };
            xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
            xhr.sendAsBinary( formData );
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