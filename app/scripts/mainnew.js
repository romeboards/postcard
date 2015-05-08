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
  postcard.addObject("sampleD", 6, { w: "90", h: "90", fill: "green" });
  // postcard.addObject("sampleE", 10, { y: "175" });

  var sampleURL = 'http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg';
  var sampleURL2 = 'https://tpwd.texas.gov/huntwild/wild/images/mammals/coyote2.jpg';

  //postcard.addImage("sampleImageA", sampleURL);
  //postcard.addImage("sampleImageZ");
  //postcard.addImage("sampleImageB", sampleURL, 0);
  //postcard.addImage("sampleImageC", sampleURL, 2, {});
  postcard.addImage("sampleImageD", sampleURL, 0, { x: "50", y: "50", w: "150", h: "150", rotation: 90 });
  //postcard.addImage("sampleImageF", sampleURL2, 0, { x: "50", y: "100", rotation: 0 });
  //postcard.addImage("sampleImageE", sampleURL2, { y: "200" });
  //var newImage = new PostcardImageObject('http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg', { w: 100, h: 100, x: 0, y: 0 });
  //this.renderingStack.add("background", 0, newImage);

  //console.log(this.renderingStack.get("background"));

  var obj = postcard.select("sampleImageD");

  $('a').click(function () {
    //console.log(obj.getRotation());
    obj.setRotation((obj.getRotation() + 90) % 360);
  });


});