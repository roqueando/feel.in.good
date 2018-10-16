const router = require('tiny-router');
const os = require('os');
const dns = require('dns');





router.use('static', {
	path: __dirname + '/www'
});

router.use('defaultPage', 'index.html');
router.listen(3000);

// TEST HARDCODED
router.get('/ip', function(req, res) {

	dns.lookup(os.hostname(), function(err, addr, fam) {
		res.send({
			ip: addr
		});
	});
	
});
console.log('listening on 3000 port');