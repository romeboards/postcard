$(document).ready(function () {

  var canvas = $('#canvas-postcard')[0];


  var postcardOptions = {
    // filename: "hidan.png",
    // backgroundColor: "#000",
    allowSelections: true
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

  //postcard.onMouseDown(dragMouseDown);
  //postcard.onMouseMove(dragMouseMove);


  postcard.addText("textsampleA", "HELLO", 10, { x: 0, y: 25, size: "24px" });
  postcard.addText("textsampleB", "I'd like to buy the world a coke.", 10, { x: 25, y: 75, family: "Times New Roman", size: "40px" });
  postcard.addText("textsampleC", "Something Else", 10, { x: 100, y: 200, fill: "red" });
  postcard.addText("textsampleD", "Last Something", 10, { x: 10, y: 260, fontString: "green italic bold 30px Cutive Mono" });


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
   for (var y = 1; y < h-1; y += 1) {
       for (var x = 1; x < w-1; x += 1) {
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

  $('a').click(function () {
  // obj = postcard.get("sampleImageD");
  });

  $('a#rotate').click(function () {
    obj.setRotation(obj.getRotation() + 90);
  });

  $('a#filterA').click(function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#4B917D", "#CDF564");  //dark, light
    obj.setImageData(newImg);
  });
  $('a#filterB').click(function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#1E3264", "#C3F0C8");  //dark, light
    obj.setImageData(newImg);
  }); 
  $('a#filterC').click(function () {
    var img = obj.getOriginalImageData();
    if(obj.flipped) img = flipImage(img);
    var newImg = Filters.duotone(img, "#503750", "#FFC864");  //dark, light
    obj.setImageData(newImg);
  });     

  $('a#flip').click(function () {
    var img = obj.getCurrentImageData();
    var newImg = flipImage(img);
    obj.setImageData(newImg);
    obj.flipped = !obj.flipped;
  }); 

  $('a#revert').click(function () {
    obj.revert();
  });

  $('a#change').click(function () {
    obj.changeURL(sampleURL3);
  });  

  $('a#save').click(function (event) {
    postcard.save(event);
  });

  // $('a#scale').click(function (event) {
  //   $('#canvas-postcard').attr("width", 150);
  //   $('#canvas-postcard').attr("height", 150);
  //   postcard.ctx.scale(.5, .5);
  //   postcard.valid = false;
  // });

  $('a#scale').click(function (event) {
    postcard.clearMouseEvents();
    postcard.onMouseDown(scaleMouseDown);
    postcard.onMouseMove(scaleMouseMove);
  });

});