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
		},
    {
      path: '/profile',
      url: '../views/profile.html'
    },
    {
      path: '/notifs',
      url: '../views/notifs.html'
    }
	],
	view: {
		stackPages: true,
		animateWithJS: true
	},


});

var socket = io('http://localhost:8080');
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
});


$$("#quotes-page").click(event => {
	event.preventDefault();


	initOrCheckUser();
	app.preloader.show();
	
});



// quotes page
$$(document).on('page:mounted', '.page[data-name="quotes"]', function (e) {
  
  fetchQuotes();
  app.preloader.hide();

  $$(".ptr-content").on('ptr:refresh', function (event) {


  	if($(".quoting").length > 0) {
  		$(".quoting").remove();
  		fetchQuotes();
  	}

  	app.ptr.done();
  });


  var emoj = "";
  var switchEmoj = "";
  $('.emj-picker').lsxEmojiPicker({
  		

  		twemoji:false,
  		onSelect: function(emoji) {

  			for(var i in $(".lsx-emojipicker-wrapper").find("span")) {
  				var em = $(".lsx-emojipicker-wrapper").find("span")[i];

  				if(em.getAttribute("title") == emoji.name) {
  					switchEmoj = em.innerHTML;
  					break;
  				}
  			}
  			
  			emoj = emoji;

  			$("#emoji-button").html(switchEmoj);
  			// console.log(switchEmoj);
  		}

  });

  $('#send-button').click(function(event) {
  	event.preventDefault();

    if(typeof emoj == "undefined" || !emoj.hasOwnProperty('name')) {
        let toast = app.toast.create({

          text: 'Escolha um emoji',
          position: 'center',
          closeTimeout: 2000

        });
        toast.open();
    }else {
        emoj.name = emoj.name.replace(/-/g, '_');

        send($('#quoteWrite').val(), emoj.name);
    }
  	
  });

  $('#callProfile').click(function(event) {
      event.preventDefault();
      app.router.navigate('/profile');
  });
});


// replies page
$$(document).on('page:mounted', '.page[data-name="replies"]', function (e) {
  


  var emojComment = "";
  var switchEmojComment = "";
  $('.emj-picker-comment').lsxEmojiPicker({
  		

  		twemoji:false,
  		onSelect: function(emoji) {

  			for(var i in $(".lsx-emojipicker-wrapper").find("span")) {
  				var em = $(".lsx-emojipicker-wrapper").find("span")[i];

  				if(em.getAttribute("title") == emoji.name) {
  					switchEmojComment = em.innerHTML;
  					break;
  				}
  			}
  			
  			emojComment = emoji;

  			$("#emoji-button-comment").html(switchEmojComment);
  			// console.log(switchEmoj);
  		}

  });

  $('#send-button-comment').click(function(event) {
  	event.preventDefault();
  	if(typeof emojComment == "undefined" || !emojComment.hasOwnProperty('name')) {
  		let toast = app.toast.create({

			text: 'Escolha um emoji',
			position: 'center',
			closeTimeout: 2000

		});
		toast.open();
  	}else {

  		emojComment.name = emojComment.name.replace(/-/g, '_');
	  	var quote = $("#replies").attr('data-idQuote');
	  	var comment = $('#quoteWrite-comment').val();
      
	  	sendReply(quote, emojComment.name, comment);

  	}
  	

  });
});

// profile page
$$(document).on('page:mounted', '.page[data-name="profile"]', function(e) {

  myProfile();
  // fetch quotes By who
});