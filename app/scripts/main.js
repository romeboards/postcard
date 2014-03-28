$(document).ready(function () {

	var canvas = $('#canvas-postcard')[0];

	canvas.postcard({ filename : "newname.png" });

	//$canvas.postcard('draw');

	// $canvas.postcard('update', 'hello dan!', {
	// 	"post" : 4,
	// 	"foo" : 45,
	// 	"bar" : "was"
	// });

	//$canvas.postcard('addImage', 'http://cdn.cutestpaw.com/wp-content/uploads/2012/04/l-my-first-kitten.jpg', 0,0, 580, 725);
	
	
	// $canvas.postcard('addImages', 
	// 	[{
	// 		"url" : "http://placekitten.com/g/300/300",
	// 		"x" : "0", "y" : "0", "w" : "300", "h" : "300"
	// 	},
	// 	{
	// 		"url" : "http://placekitten.com/g/150/160",
	// 		"x" : "300", "y" : "0", "w" : "150", "h" : "160"
	// 	},
	// 	{
	// 		"url" : "http://placekitten.com/g/150/140",
	// 		"x" : "300", "y" : "160", "w" : "150", "h" : "140"
	// 	},
	// 	{
	// 		"url" : "http://placekitten.com/g/340/100",
	// 		"x" : "450", "y" : "0", "w" : "340", "h" : "100"
	// 	},
	// 	{
	// 		"url" : "http://placekitten.com/g/210/100",
	// 		"x" : "790", "y" : "0", "w" : "210", "h" : "100"
	// 	},
	// 	{
	// 		"url" : "http://placekitten.com/g/550/200",
	// 		"x" : "450", "y" : "100", "w" : "550", "h" : "200"
	// 	}]
	// );



	// $canvas.postcard('addImage', 'http://www.roninathletics.com/uploads/1/1/8/6/11868855/1341639273.png', 0,0, 180, 270);
	// $canvas.postcard('addImage', 'http://1.bp.blogspot.com/-yfyp8XITuA4/TMcf1djnL1I/AAAAAAAAGXo/qg6RHHBaTDU/s1600/smiley_with_thumbs_up.gif', 180,0, 500, 270);


	$(canvas).on('postcardimagesloading', function () {
		$('.container').addClass('generating');
	});


	//format : "hex style weight size family"
	var hStyle = "#fff normal normal 45px Tahoma",
	 	pStyle = "#fff normal normal 35px sans-serif",
	 	smallStyle = "blue normal normal 65px Tahoma";

	canvas.postcard('add', [
		{
			"url" : "http://placekitten.com/g/300/300",
			"x" : "0", "y" : "0", "w" : "300", "h" : "300"
		},
		{
			"text" : "header header", "style" : hStyle, 
			"x" : "50", "y" : "60"
		},
		{
			"url" : "http://placekitten.com/g/150/160",
			"x" : "300", "y" : "0", "w" : "150", "h" : "160"
		},
		{
			"text" : "the whole thing", "style" : pStyle, 
			"x" : "50", "y" : "150"
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
			"text" : "more more text", "style" : pStyle, 
			"x" : "50", "y" : "200"
		},
		{
			"text" : "hello hello!", "style" : pStyle, 
			"x" : "50", "y" : "250"
		},
		{
			"url" : "http://placekitten.com/g/210/100",
			"x" : "790", "y" : "0", "w" : "210", "h" : "100"
		},
		{
			"url" : "http://placekitten.com/g/550/200",
			"x" : "450", "y" : "100", "w" : "550", "h" : "200"
		},
		{
			"x1" : "50", "y1" : "50",
			"x2" : "100", "y2" : "100",
			"color" : "blue",
			"weight" : "10"
		},
		{
			"x1" : "100", "y1" : "100",
			"x2" : "150", "y2" : "50",
			"color" : "blue"
		}
	]);

	canvas.postcard('setBreakpoint', 1000, 600, [
		{
			"url" : "http://placekitten.com/g/400/150",
			"x" : "0", "y" : "0", "w" : "400", "h" : "150"
		},
		{
			"url" : "http://placekitten.com/g/200/150",
			"x" : "400", "y" : "0", "w" : "200", "h" : "150"
		},
		{
			"url" : "http://placekitten.com/g/200/150",
			"x" : "0", "y" : "150", "w" : "200", "h" : "150"
		},
		{
			"url" : "http://placekitten.com/g/400/150",
			"x" : "200", "y" : "150", "w" : "400", "h" : "150"
		},
		{
			"text" : "smalller", "style" : smallStyle, 
			"x" : "100", "y" : "250"
		},
		{
			"x1" : "200", "y1" : "200",
			"x2" : "400", "y2" : "0"		
		}
		// },
		// {
		// 	"text" : "header header", "style" : hStyle, 
		// 	"x" : "50", "y" : "60"
		// },
		// {
		// 	"url" : "http://placekitten.com/g/150/160",
		// 	"x" : "300", "y" : "0", "w" : "150", "h" : "160"
		// },
		// {
		// 	"text" : "the whole thing", "style" : pStyle, 
		// 	"x" : "50", "y" : "150"
		// },
		// {
		// 	"url" : "http://placekitten.com/g/150/140",
		// 	"x" : "300", "y" : "160", "w" : "150", "h" : "140"
		// },
		// {
		// 	"url" : "http://placekitten.com/g/340/100",
		// 	"x" : "450", "y" : "0", "w" : "340", "h" : "100"
		// },
		// {
		// 	"text" : "more more text", "style" : pStyle, 
		// 	"x" : "50", "y" : "200"
		// },
		// {
		// 	"text" : "hello hello!", "style" : pStyle, 
		// 	"x" : "50", "y" : "250"
		// },
		// {
		// 	"url" : "http://placekitten.com/g/210/100",
		// 	"x" : "790", "y" : "0", "w" : "210", "h" : "100"
		// },
		// {
		// 	"url" : "http://placekitten.com/g/550/200",
		// 	"x" : "450", "y" : "100", "w" : "550", "h" : "200"
		// }
	]);

	//$canvas.postcard('addText', "sup.", 50, 50);




	$(canvas).on('postcardimagesloaded', function () {

		$('.container').removeClass('generating');

	// canvas.postcard('drawLine',
	// 	{
	// 		x1: "50", y1: "50",
	// 		x2: "100", y2: "100",
	// 		color: "blue",
	// 		weight: "50"
	// 	}
	// );


		//console.log('all images loaded');
		//$canvas.postcard('addText', "sup", 50, 50);
		// $canvas.postcard('setFontSize', "50px");
		// //$canvas.postcard('addText', "bigger", 50, 100);
		// $canvas.postcard('setFontWeight', "bold");
		// $canvas.postcard('addText', "good email!", 50, 160);
		// $canvas.postcard('setFontStyle', "italic");
		// $canvas.postcard('addText', "italic", 50, 220);
		// $canvas.postcard('setFont', "blue normal bold 25px Tahoma");
		// $canvas.postcard('addText', "new style", 250, 50);

		// // using external fonts
		// var headerStyle = "red normal normal 75px Cutive Mono",
		// 	paragraphStyle = "green normal normal 25px Times New Roman";
		// $canvas.postcard('addFullText', "the whole thing", headerStyle, 250,150);
		// $canvas.postcard('addFullText', "more text", paragraphStyle, 250,200);
	});





	$(canvas).on('postcardimageerror', function (event, status) {
		console.log('ERROR: ' + status);
	});


	$('a').click(function (event) {
		//$canvas.postcard('save', event);
		console.log('hello');
		canvas.postcard('shareOnFB', 'hello, cruel world');
	});

});