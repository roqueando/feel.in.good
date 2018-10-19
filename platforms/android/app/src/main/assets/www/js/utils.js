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
									<p class="text-align-center">${response.quotes[i].who} as <i>${response.quotes[i].createdAt.getHours()}:${response.quotes[i].createdAt.getMinutes()}</i></p>

								</div>
							  <div class="card-content card-content-padding">
							  		
							  		<img src="img/left-quote.png">
							  			${response.quotes[i].quote}
							  		<img src="img/right-quote.png">
							  		<br>

							  		-- ${response.quotes[i].what_u_need}

							  </div>
							  <div class="card-footer" >
							  	<div id="emoji-append">
							  	</div>
							  	<a href="#" id="reply-button" class="link" onclick="fetchReplies('${response.quotes[i]._id}')"> ${response.quotes[i].replies.length} replies</a></div>
							</div>
						</div>
						
					</div>

				`);

				for(let r in response.quotes[i].replies) {
					if(response.quotes[i].replies.length <= 3) {
						$$("#emoji-append").append(`
								<p>${response.quotes[i].replies[r].emoji} </p>						
						`);
						
					}
				}
				

			}

		}

	}, function(err) {

		console.log(err);
	}, 'json');

}

function fetchReplies(quote) {

	app.router.navigate('/replies');
	app.request.post('http://localhost:8080/replies', {quotes: quote}, function(response) {

		console.log(response);

		if(response.replies.length > 0) {

			for(var r in response.replies) {
				response.replies[r].createdAt = new Date(response.replies[r].createdAt);
				if(response.replies[r].persons._id == localStorage.getItem('user_id')) {
					$$("#replies .padding").append(`

						<div class="sent-bubble padding">
							<div class="dateTimeUserSent">
								${response.replies[r].persons.name} <i> at ${response.replies[r].createdAt.getHours()}:${response.replies[r].createdAt.getMinutes()} -- ${response.replies[r].emoji}</i>

							</div>
							<div class="spacement-10"></div>
							<div class="sent-text">
								${response.replies[r].comment}
							</div>
							
						</div>

						<div class="spacement"></div>

					`);
				}else {

					$$("#replies .padding").append(`

						<div class="received-bubble padding">
							<div class="dateTimeUserRcv">
								${response.replies[r].persons.name} <i> at ${response.replies[r].createdAt.getHours()}:${response.replies[r].createdAt.getMinutes()} -- ${response.replies[r].emoji}</i>

							</div>
							<div class="spacement-10"></div>
							<div class="sent-text">
								${response.replies[r].comment}
							</div>
							
						</div>
						<div class="spacement"></div>

					`);
				}
			}
		

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

function switchToSend() {

	if($$("#quoteWrite").val() > 0) {

		$$("#write-change").html('citar');
	}
}