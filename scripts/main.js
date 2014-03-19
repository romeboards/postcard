$(document).ready(function () {

	var $canvas = $('#canvas-postcard');

	//$canvas.postcard();
	$canvas.postcard({ "backgroundImgUrl" : "" });

	//$canvas.postcard('draw');

	// $canvas.postcard('update', 'hello dan!', {
	// 	"post" : 4,
	// 	"foo" : 45,
	// 	"bar" : "was"
	// });

	//$canvas.postcard('addImage', 'http://cdn.cutestpaw.com/wp-content/uploads/2012/04/l-my-first-kitten.jpg', 0,0, 580, 725);
	
	
	$canvas.postcard('addImages', { "images" : 
		[{
			"url" : "http://placekitten.com/g/300/300",
			"x" : "0", "y" : "0", "w" : "300", "h" : "300"
		},
		{
			"url" : "http://placekitten.com/g/150/160",
			"x" : "300", "y" : "0", "w" : "150", "h" : "160"
		},
		{
			"url" : "http://placekitten.com/g/150/140",
			"x" : "300", "y" : "160", "w" : "150", "h" : "140"
		},
		{
			"url" : "http://placekitten.com/g/340/100",
			"x" : "450", "y" : "0", "w" : "340", "h" : "100"
		},
		{
			"url" : "http://placekitten.com/g/210/100",
			"x" : "790", "y" : "0", "w" : "210", "h" : "100"
		},
		{
			"url" : "http://placekitten.com/g/550/200",
			"x" : "450", "y" : "100", "w" : "550", "h" : "200"
		}]
	});

	$canvas.postcard('addImage', 'http://watchoutfor.com.au/wp-content/uploads/2009/12/cute-kitten.jpg', 0,0, 422, 388);

	//$canvas.postcard('addText', "sup.", 50, 50);

	$canvas.on('postcardimagesloaded', function () {
		console.log('all images loaded');
		$canvas.postcard('addText', "sup", 50, 50);
		$canvas.postcard('setFontSize', "50px");
		$canvas.postcard('addText', "bigger", 50, 100);
		$canvas.postcard('setFontWeight', "bold");
		$canvas.postcard('addText', "bold", 50, 160);
		$canvas.postcard('setFontStyle', "italic");
		$canvas.postcard('addText', "italic", 50, 220);
		$canvas.postcard('setFont', "blue normal bold 25px Tahoma");
		$canvas.postcard('addText', "new style", 250, 50);

		// using external fonts
		var headerStyle = "red normal normal 75px Cutive Mono",
			paragraphStyle = "green normal normal 25px Times New Roman";
		$canvas.postcard('addFullText', "the whole thing", headerStyle, 250,150);
		$canvas.postcard('addFullText', "more text", paragraphStyle, 250,200);
	});

	$canvas.on('postcardimageerror', function (event, status) {
		console.log('ERROR: ' + status);
	});

	$('a').click(function (event) {
		$canvas.postcard('save', event);
	});

});