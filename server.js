const express = require('express');
const bodyParser = require('body-parser');
const apiSecretKey = require('./apiKey');
const softwareLicenceKey = require('./licenceKey');

const port = 3000;

const licenceAPI = new express();
const licenceRouter = express.Router();
const apiKey = new apiSecretKey(port);
const licenceKey = new softwareLicenceKey();
const secretKey = '';

licenceAPI.use(bodyParser.urlencoded({ extended: false }));
licenceAPI.use(bodyParser.json());
 
licenceRouter.use(function (req, res, next) {

	res.header('Content-Type', 'text/plain');

	console.log('\n\nNew Request ', req.method, req.url);

	if(req.headers.key !== apiKey.key) {
		console.log('Authentication failed for key ', req.headers.key);
		res.sendStatus(401);
	} else {
		next();
	}
});

licenceRouter.route('/genLicenceKey').get(function(req, res) {
	Promise.all([licenceKey.generateLicenceKey(licKey, req.headers.fullname, req.headers.package)])
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
	Promise.all([licenceKey.validateLicenceKey(licKey, req.headers.licence, req.headers.fullname)])
	.then((valid) => {
		if(valid) {
			console.log('Licence key is valid for: ', req.headers.fullname);
			res.sendStatus(204);
		} else {
			console.log('Licence key is not valid: ', req.headers.licence);
			res.sendStatus(404);
		}
	}).catch((e) => {
		console.log(e);
		res.sendStatus(404);
	});
});

licenceAPI.use('/api', licenceRouter);

apiKey.createApiSecret().then((secretKey) => {
	licKey = secretKey;
	apiKey.createApiSecret().then((key) => {
		console.log('API access key is: ', key);
		licenceAPI.listen(port, () => {
			console.log('Licence server live on port ' + port);	
		});
	}).catch((e) => {
		console.log('Failed to generate authentication key.');
		console.log(e);
	})
}).catch((e) => {
	console.log('Failed to generate secret key for licence generation.');
	console.log(e.Message);
});
