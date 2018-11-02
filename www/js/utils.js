function initOrCheckUser() {

	app.request.get('/ip', function(response, statusCode, xhr) {
		
		
		
		app.request.post('http://localhost:8080/create', {
			ip: response.ip,
			name: 'Anonymn'
		}, function(response) {
			localStorage.setItem('user_ip', response.name.ip);
			localStorage.setItem('user_id', response.name._id);
			localStorage.setItem('user_name', response.name.name);

			app.router.navigate('/quotes');

		}, function(err) {
			console.log(err);
		}, 'json');
		
	}, function(err) {
		console.log(err);
	}, 'json');

}

function fetchQuotes() {

	app.request.get('http://localhost:8080/quotes', function(response) {
		if(response.quotes.length > 0) {
			for(let i in response.quotes) {
				response.quotes[i].createdAt = new Date(response.quotes[i].createdAt);

				
				$$(`#quotes`).append(`
					<div class="row padding quoting" data-idQuote="${response.quotes[i]._id}">
						<div class="col">
							<div class="card">
								<div class="card-header">
									<p class="text-align-center">${response.quotes[i].user.name} as <i>${response.quotes[i].createdAt.getHours()}:${response.quotes[i].createdAt.getMinutes()}</i></p>

								</div>

							  <div class="card-content card-content-padding">
							  		
							  		<img src="img/left-quote.png">
							  			${response.quotes[i].quote}
							  		<img src="img/right-quote.png">
							  		<br>

							  		-- ${response.quotes[i].what_u_need}

							  </div>
							  <div class="card-footer align-items-center text-align-center" >
							  	
							  	<a href="#" id="reply-button" class="button" onclick="fetchReplies('${response.quotes[i]._id}')"> ${response.quotes[i].replies.length} replies</a></div>
							</div>
						</div>
						
					</div>

				`);

				
				

			}

		}

	}, function(err) {

		console.log(err);
	}, 'json');

}

function fetchReplies(quote) {

	app.router.navigate('/replies');
	app.request.post('http://localhost:8080/replies', {quotes: quote}, function(response) {

		$$("#replies").attr("data-idQuote", quote);
		if(response.replies.length > 0) {

			for(var r in response.replies) {
				response.replies[r].createdAt = new Date(response.replies[r].createdAt);

				
				if(response.replies[r].user._id == localStorage.getItem('user_id')) {

					if($(".sent-bubble padding").length > 0) {
						$(".sent-bubble padding").remove();	
					}
					$$(".replies-place").append(`

						<div class="sent-bubble padding" >
							<div class="dateTimeUserSent" style="font-size: 16px">
								${response.replies[r].user.name} <i> at ${response.replies[r].createdAt.getHours()}:${response.replies[r].createdAt.getMinutes()} </i> -- ${response.replies[r].emoji}

							</div>
							<br>
							<div class="spacement-10"></div>
							<div class="sent-text">
								${response.replies[r].comment}
							</div>
							
						</div>

						<div class="spacement"></div>

					`);
				}else {

					$$(".replies-place").append(`

						<div class="received-bubble padding" >
							<div class="dateTimeUserRcv" style="font-size: 16px">
								${response.replies[r].user.name} <i> at ${response.replies[r].createdAt.getHours()}:${response.replies[r].createdAt.getMinutes()} </i> -- ${response.replies[r].emoji}

							</div>
							<br>
							<div class="spacement-10"></div>
							<div class="sent-text">
								${response.replies[r].comment}
							</div>
							
						</div>
						<div class="spacement"></div>

					`);
				}
			} 
		

		} else {

			$$("#replies .padding").html(`
				<h1 style="color: #999">Essa citação não possui comentários. Seja o primeiro a comentar! 😜</h1>
			`);
		}
		
	}, function(err) {

		console.log(err);

	}, 'json');
}


function writeQuote() {

	if($$("#writeLine").css("display") == "none") {
		$$("#writeLine").show();
		$$("#writeLine").animate({
			'opacity': 1
		}, {
			duration: 300,
			
		});

	}else {
		
		$$("#writeLine").animate({
			'opacity': 0
		}, {
			duration: 300,
			complete: function(el) {
				$$("#writeLine").hide();

			}

		});
	}

}


function writeQuoteComment() {
	
	if($$("#writeLine-comment").css("display") == "none") {
		$$("#writeLine-comment").show();
		$$("#writeLine-comment").animate({
			'opacity': 1
		}, {
			duration: 300,
			
		});

	}else {
		
		$$("#writeLine-comment").animate({
			'opacity': 0
		}, {
			duration: 300,
			complete: function(el) {
				$$("#writeLine-comment").hide();

			}

		});
	}

}
function send(quote, emoji) {

	app.request.post('http://localhost:8080/publish', {
		user: localStorage.getItem('user_id'),
		quote: quote,
		what_u_need: emoji

	}, function(response) {

		console.log(response);

		$("#quoteWrite").val('');

		let toast = app.toast.create({

			text: 'Sua citação foi publicada. 😄',
			position: 'center',
			closeTimeout: 2000

		});
		toast.open();


	}, function(err) {

		console.log(err);

	}, 'json');

}

function sendReply(quote, emoji, comment, image = "") {

	app.request.post('http://localhost:8080/reply', {
		user: localStorage.getItem('user_id'),
		quotes: quote,
		comment: comment,
		image: image,
		emoji: emoji

	}, function(response) {

		console.log(response);

		$("#quoteWrite-comment").val('');

		let toast = app.toast.create({

			text: 'Seu comentario foi publicado. 😄',
			position: 'center',
			closeTimeout: 2000

		});
		toast.open();


	}, function(err) {

		console.log(err);

	}, 'json');

}

function myProfile() {
	
	
	$.ajax({

		url: 'http://localhost:8080/profile',
		type: "POST",
		dataType: "json",
		data: {
			ip: localStorage.getItem("user_ip"),
		},
		success: function(res) {
			console.log(res);
			$$("#profile .bg").append(`

				<div class="row">
					<div class="col">
						
						<img src="${res.user.photo}"class="profile-avatar">
						
							
						
					</div>
				</div>

				<div class="row">
					
					<div style="border: 10px solid transparent"></div>
					<div class="col text-align-center">
						<span class="profile-username">${res.user.name}</span>
					</div>

				</div>

				<div class="row padding ">
					
					<div class="col text-align-center">
						<button class="button" style="background-color: #74b9ff; color: #333">foto</button>
					</div>
					<div class="col text-align-center">
						<button class="button" style="background-color: #00b894; color: #333">nome</button>
					</div>
					<div class="col text-align-center">
						<button class="button" style="background-color: #a29bfe; color: #333">fundo</button>
					</div>
					

				</div>


			`);

			fetchQuoteByWho(res.user._id);


		},
		error: function(err) {

			console.log(err);
			
		}
	});	

}

function fetchQuoteByWho(who) {

	$.ajax({

		url: `http://localhost:8080/quotes/${who}`,
		type: "GET",
		dataType: "json",
		success: (response) => {
			console.log(response);
			if(response.quotes.length > 0) {
				for(let i in response.quotes) {
					response.quotes[i].createdAt = new Date(response.quotes[i].createdAt);


					$$(`.best-quotes`).append(`
						<div class="row padding quoting" data-idQuote="${response.quotes[i]._id}">
							<div class="col">
								<div class="card">
									<div class="card-header">
										<p class="text-align-center">${response.quotes[i].user.name} as <i>${response.quotes[i].createdAt.getHours()}:${response.quotes[i].createdAt.getMinutes()}</i></p>

									</div>

								  <div class="card-content card-content-padding">
								  		
								  		<img src="img/left-quote.png">
								  			${response.quotes[i].quote}
								  		<img src="img/right-quote.png">
								  		<br>

								  		-- ${response.quotes[i].what_u_need}

								  </div>
								  <div class="card-footer align-items-center text-align-center" >
								  	
								  	<a href="#" id="reply-button" class="button" onclick="fetchReplies('${response.quotes[i]._id}')"> ${response.quotes[i].replies.length} replies</a></div>
								</div>
							</div>
							
						</div>

					`);

					
					

				}

			}
		},
		error: (err) => {
			console.log(err);
		}
	});

}