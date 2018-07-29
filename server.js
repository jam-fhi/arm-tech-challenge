const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;

const licenceAPI = new express();
const licenceRouter = express.Router();

licenceAPI.use(bodyParser.urlencoded({ extended: false }));
licenceAPI.use(bodyParser.json());
 
licenceRouter.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', "X-Requested-With");
	res.header('Content-Type', 'text/json');
  	next();
});

licenceRouter.route('/genLicenceKey').get(function(req, res) {
	res.send(JSON.stringify({"service":'Generate Licence Key'}));
});

licenceRouter.route('/validateLicenceKey').get(function(req, res) {
	res.send(JSON.stringify({"service":'Validate Licence Key'}));
});

licenceAPI.use('/api', licenceRouter);

licenceAPI.listen(port, () => {
	console.log('Licence server live on port ' + port);
});