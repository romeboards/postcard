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