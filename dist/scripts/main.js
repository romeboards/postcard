function rgb2hex(r, g, b) {

    var hex = function(x) {
      var h = x.toString(16);
      return h.length == 1 ? "0" + h : h;      
    };

    return "#" + hex(r) + hex(g) + hex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

var Filters = {};

Filters.grayscale = function(pixels) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v;
  }
  return pixels;
};

Filters.duotone = function(img, tone1, tone2) {
  var gradient = this.gradientMap(tone1, tone2);
  img = Filters.grayscale(img);
  var d = img.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] = gradient[d[i]*4];
    d[i+1] = gradient[d[i+1]*4 + 1];
    d[i+2] = gradient[d[i+2]*4 + 2];
  }
  return img;
};

Filters.gradientMap = function (tone1, tone2) {
  var rgb1 = hexToRgb(tone1);
  var rgb2 = hexToRgb(tone2);
  var gradient = [];
  for (var i=0; i<(256*4); i+=4) {
    gradient[i] = ((256-(i/4))*rgb1.r + (i/4)*rgb2.r)/256;
    gradient[i+1] = ((256-(i/4))*rgb1.g + (i/4)*rgb2.g)/256;
    gradient[i+2] = ((256-(i/4))*rgb1.b + (i/4)*rgb2.b)/256;
    gradient[i+3] = 255;
  }
  return gradient;
};
(function() {

  var canvas = document.getElementById("canvas-postcard");


  var postcardOptions = {
    // filename: "hidan.png",
    backgroundColor: "red",
    allowSelections: true,
    fontFamily: "Cutive Mono",
    fontColor: "blue"
  };

  var postcard = new Postcard(canvas, postcardOptions);

  var sampleURL = 'http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg';
  postcard.addImage("background", sampleURL, { x: -50, y: -50, w: 450, h: 450 });
  var background = postcard.get("background");


  var dragMouseDown = function (x,y) {
    postcard.dragoffx = x - background.x;
    postcard.dragoffy = y - background.y;
  };
  var dragMouseMove = function (x,y) {
    if(background && postcard.dragging) {
      background.x = x - postcard.dragoffx;
      background.y = y - postcard.dragoffy; 
      if(background.x >= 0) background.x = 0;
      else if((background.x+background.w) <= postcard.width) background.x = postcard.width - background.w;
      if(background.y >= 0) background.y = 0;
      else if((background.y+background.h) <= postcard.height) background.y = postcard.height - background.h;     
      postcard.valid = false; // Something's dragging so we must redraw
    }
  };
  var scaleMouseDown = function (x,y) {
    postcard.dragoffx = x;
    postcard.dragoffy = y;
  };
  var scaleMouseMove = function (x,y) {
    if(background && postcard.dragging) {

      console.log((x-postcard.dragoffx) + " " + (y-postcard.dragoffy));
      background.w += x-postcard.dragoffx;
      background.h += y-postcard.dragoffy;


      // background.x = x - postcard.dragoffx;
      // background.y = y - postcard.dragoffy; 
      // if(background.x >= 0) background.x = 0;
      // else if((background.x+background.w) <= postcard.width) background.x = postcard.width - background.w;
      // if(background.y >= 0) background.y = 0;
      // else if((background.y+background.h) <= postcard.height) background.y = postcard.height - background.h;     
      postcard.valid = false; // Something's dragging so we must redraw
    }
  };

  postcard.onMouseDown(dragMouseDown);
  postcard.onMouseMove(dragMouseMove);


  postcard.addText("textsampleA.change", "HELLO", 10, { x: 0, y: 25, size: "24px" });
  postcard.addText("textsampleB", "I'd like to buy the world a coke.", 10, { x: 25, y: 75, size: "40px" });
  postcard.addText("textsampleC.change", "Something Else", 10, { x: 100, y: 200, fill: "red" });
  postcard.addText("textsampleD", "Last Something", 10, { x: 10, y: 260, fontString: "green italic bold 30px Cutive Mono" });

  postcard.get("textsampleA.change").changeText("HELLO, DAN");

  // postcard.addObject("sampleA");
  // postcard.addObject("sampleB", 0);
  // postcard.addObject("sampleC", 2, {});
  postcard.addObject("sampleD", 6, { w: 90, h: 90, fill: "green" });
  // postcard.addObject("sampleE", 10, { y: "175" });


  var sampleURL2 = 'https://tpwd.texas.gov/huntwild/wild/images/mammals/coyote2.jpg';
  var sampleURL3 = 'http://cdn.cultofmac.com/wp-content/uploads/2012/07/mountainlion1.jpg';

  //postcard.addImage("sampleImageA", sampleURL);
  //postcard.addImage("sampleImageZ");
  //postcard.addImage("sampleImageB", sampleURL, 0);
  //postcard.addImage("sampleImageC", sampleURL, 2, {});

  postcard.addImage("sampleImageF", sampleURL2, 5, { x: 100, y: 100, w: 100, h: 100 });
  //postcard.addImage("sampleImageE", sampleURL2, { y: "200" });
  //var newImage = new PostcardImageObject('http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg', { w: 100, h: 100, x: 0, y: 0 });
  //this.renderingStack.add("background", 0, newImage);

  //console.log(this.renderingStack.get("background"));

 // var obj = postcard.get("sampleImageD");

 var flipImage = function(input) {
   //var input = context.getImageData(0, 0, canvas.width, canvas.height);
  // Create output image data temporary buffer
   var tempCtx = document.createElement('canvas').getContext('2d');
   var output = tempCtx.createImageData(input.width, input.height);
   // Get imagedata size
   var w = input.width, h = input.height;
   //console.log("w: " + w + " h: " + h);
   var inputData = input.data;
   var outputData = output.data
   // loop
   for(var y = 1; y < h-1; y += 1) {
       for(var x = 1; x < w-1; x += 1) {
         // RGB
         var i = (y*w + x)*4;
         var flip = (y*w + (w - x))*4;
         for (var c = 0; c < 4; c += 1) {
            outputData[i+c] = inputData[flip+c];
         }
       }
   }
   return output;
   //context.putImageData(output, 0, 0);
 }





  var obj = background;
  obj.flipped = false;

  document.getElementById("rotate").addEventListener("click", function () {
    obj.setRotation(obj.getRotation() + 90);
  });

  document.getElementById("filterA").addEventListener("click", function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#4B917D", "#CDF564");  //dark, light
    obj.setImageData(newImg);
  });
  document.getElementById("filterB").addEventListener("click", function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#1E3264", "#C3F0C8");  //dark, light
    obj.setImageData(newImg);
  }); 
  document.getElementById("filterC").addEventListener("click", function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#503750", "#FFC864");  //dark, light
    obj.setImageData(newImg);
  });     

  document.getElementById("flip").addEventListener("click", function () {
    var img = obj.getCurrentImageData();
    var newImg = flipImage(img);
    obj.setImageData(newImg);
    obj.flipped = !obj.flipped;
  }); 

  document.getElementById("revert").addEventListener("click", function () {
    obj.revert();
  });

  document.getElementById("change").addEventListener("click", function () {
    obj.changeURL(sampleURL3);
  });  

  document.getElementById("save").addEventListener("click", function (event) {
    postcard.save(event);
  });

  document.getElementById("text").addEventListener("click", function (event) {
    var text = postcard.getSome(function (key, zindex, value) {
      if(key.indexOf(".change") > -1) return true;
      else return false;
    });
    text.forEach(function (elm) {
      elm.setFont("blue normal bold 30px Georgia");
    });
  });

  // $('a#scale').click(function (event) {
  //   $('#canvas-postcard').attr("width", 150);
  //   $('#canvas-postcard').attr("height", 150);
  //   postcard.ctx.scale(.5, .5);
  //   postcard.valid = false;
  // });

  document.getElementById("scale").addEventListener("click", function (event) {
    postcard.clearMouseEvents();
    postcard.onMouseDown(scaleMouseDown);
    postcard.onMouseMove(scaleMouseMove);
  });

})();