$(document).ready(function () {

  var canvas = $('#canvas-postcard')[0];

  var postcardOptions = {
    filename: "hidan.png",
    backgroundColor: "#000",

  };

  var postcard = new Postcard(canvas, postcardOptions);


  postcard.addObject("sampleA");
  postcard.addObject("sampleB", 0);
  postcard.addObject("sampleC", 2, {});
  postcard.addObject("sampleD", 6, { y: "25", fill: "green" });
  postcard.addObject("sampleE", { y: "150" });

  var sampleURL = 'http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg';

  postcard.addImage("sampleImageA", sampleURL);
  //postcard.addImage("sampleImageZ");
  postcard.addImage("sampleImageB", sampleURL, 0);
  postcard.addImage("sampleImageC", sampleURL, 2, {});
  postcard.addImage("sampleImageD", sampleURL, 0, { x: "50" });
  postcard.addImage("sampleImageE", sampleURL, { y: "200" });
  //var newImage = new PostcardImageObject('http://vignette3.wikia.nocookie.net/animalcrossing/images/b/bd/Grey-wolf_565_600x450.jpg', { w: 100, h: 100, x: 0, y: 0 });
  //this.renderingStack.add("background", 0, newImage);

  //console.log(this.renderingStack.get("background"));


});