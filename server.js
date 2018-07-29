const express = require('express');
const bodyParser = require('body-parser');
const apiSecretKey = require('./apiKey');
const softwareLicenceKey = require('./licenceKey');

const port = 3000;

const licenceAPI = new express();
const licenceRouter = express.Router();
const apiKey = new apiSecretKey(port);
const licenceKey = new softwareLicenceKey();

licenceAPI.use(bodyParser.urlencoded({ extended: false }));
licenceAPI.use(bodyParser.json());
 
licenceRouter.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', "X-Requested-With");
	res.header('Content-Type', 'text/plain');

	if(req.headers.key !== apiKey.key) {
		console.log('Authentication failed for key ', req.headers.key);
		res.sendStatus(401);
	}

	next();
});

licenceRouter.route('/genLicenceKey').get(function(req, res) {
	Promise.all([licenceKey.generateLicenceKey(apiKey.key, req.headers.fullname, req.headers.package)])
	.then((key) => {

		if(key[0] === 404) {
			console.log('Licence Request Failed Validation.');
			res.sendStatus(404);
		} else {
			console.log('New Licence key generated for', req.headers.fullname, req.headers.package, key[0]);
			res.send(key[0]);
		}

	}).catch((e) => {
		console.log(e);
		res.sendStatus(500);
	});
});

licenceRouter.route('/validateLicenceKey').get(function(req, res) {
	Promise.all([licenceKey.validateLicenceKey(apiKey.key, req.headers.licence, req.headers.fullname)])
	.then((valid) => {
		if(valid) {
			console.log('Licence key is valid for ', req.headers.fullname);
			res.sendStatus(204);
		} else {
			console.log('Licence key is not valid. ', req.headers.licence);
			res.sendStatus(404);
		}
	}).catch((e) => {
		console.log(e);
		res.sendStatus(404);
	});
});

licenceAPI.use('/api', licenceRouter);

apiKey.createApiSecret().then((key) => {
	console.log('API access key is: ', key);
	licenceAPI.listen(port, () => {
		console.log('Licence server live on port ' + port);	
	});
}).catch((e) => {
	console.log('Failed to start API server.');
	console.log(e.Message);
});
