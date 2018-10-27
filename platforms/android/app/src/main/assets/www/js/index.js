var app = new Framework7({

	root: '#app',
	name: 'feel.in',
	id: 'com.feelin.pack',
	routes: [
		{
			path: '/quotes',
			url: '../views/quotes.html'
		},
		{
			path: '/replies',
			url: '../views/replies.html'
		}
	],
	view: {
		stackPages: true,
		animateWithJS: true
	},


});
var $$ = Dom7;
var mainView = app.views.create('.view-main', {
	domCache: true
});

var granimInstance = new Granim({
    element: '#canvas-basic',
    name: 'basic-gradient',
    direction: 'diagonal', // 'diagonal', 'top-bottom', 'radial'
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#AA076B', '#61045F'],
                ['#02AAB0', '#00CDAC'],
                ['#DA22FF', '#9733EE']
            ]
        }
    }
});



$$("#quoteWrite").focus(function(e) {
	e.preventDefault();
	console.log('clicked');
})


$$("#quotes-page").click(event => {
	event.preventDefault();


	initOrCheckUser();
	app.preloader.show();
	
});



$$(document).on('page:mounted', '.page[data-name="quotes"]', function (e) {
  
  fetchQuotes();
  app.preloader.hide();

  $('#quoteWrite').twemojiPicker({
  	icon: 'smiley',
  	pickerPosition: 'top'
  });

});



