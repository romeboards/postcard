$(document).ready(function () {

  var canvas = $('#canvas-postcard')[0];


  var postcardOptions = {
    filename: "hidan.png",
    backgroundColor: "#000",
  };

  var postcard = new Postcard(canvas, postcardOptions);


  // postcard.addObject("sampleA");
  // postcard.addObject("sampleB", 0);
  // postcard.addObject("sampleC", 2, {});
  postcard.addObject("sampleD", 6, { w: 90, h: 90, fill: "green" });
  // postcard.addObject("sampleE", 10, { y: "175" });

  var sampleURL = 'http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg';
  var sampleURL2 = 'https://tpwd.texas.gov/huntwild/wild/images/mammals/coyote2.jpg';
  var sampleURL3 = 'http://cdn.cultofmac.com/wp-content/uploads/2012/07/mountainlion1.jpg';

  //postcard.addImage("sampleImageA", sampleURL);
  //postcard.addImage("sampleImageZ");
  //postcard.addImage("sampleImageB", sampleURL, 0);
  //postcard.addImage("sampleImageC", sampleURL, 2, {});
  postcard.addImage("sampleImageD", sampleURL, { x: 50, y: 50, w: 250, h: 250 });
  postcard.addImage("sampleImageF", sampleURL2, 5, { x: 100, y: 100, w: 100, h: 100 });
  //postcard.addImage("sampleImageE", sampleURL2, { y: "200" });
  //var newImage = new PostcardImageObject('http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg', { w: 100, h: 100, x: 0, y: 0 });
  //this.renderingStack.add("background", 0, newImage);

  //console.log(this.renderingStack.get("background"));

 // var obj = postcard.get("sampleImageD");
  var obj;

  $('a').click(function () {
    obj = postcard.getSelection() || postcard.get("sampleImageD");
  });

  $('a#rotate').click(function () {
    obj.setRotation(obj.getRotation() + 90);
  });

  $('a#filterA').click(function () {
    var img = obj.getOriginalImageData();
    var newImg = Filters.duotone(img, "#4B917D", "#CDF564");  //dark, light
    obj.setImageData(newImg);
  });
  $('a#filterB').click(function () {
    var img = obj.getOriginalImageData();
    var newImg = Filters.duotone(img, "#1E3264", "#C3F0C8");  //dark, light
    obj.setImageData(newImg);
  }); 
  $('a#filterC').click(function () {
    var img = obj.getOriginalImageData();
    var newImg = Filters.duotone(img, "#503750", "#FFC864");  //dark, light
    obj.setImageData(newImg);
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

  $('a#scale').click(function (event) {
    $('#canvas-postcard').attr("width", 150);
    $('#canvas-postcard').attr("height", 150);
    postcard.ctx.scale(.5, .5);
    postcard.valid =false;
  });


});