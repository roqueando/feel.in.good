const router = require('tiny-router');
const os = require('os');
const dns = require('dns');
const mac = require('getmac');




router.use('static', {
	path: __dirname + '/www'
});

router.use('defaultPage', 'index.html');
router.listen(3000);

// TEST HARDCODED
router.get('/ip', function(req, res) {
	
	mac.getMac(function(err, macAddr) {

		if(err) throw err;

		res.send({
			ip: macAddr
		});

	});

	
});
console.log('listening on 3000 port');