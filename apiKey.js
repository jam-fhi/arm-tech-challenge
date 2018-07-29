const getmac = require('getmac');
const util = require('util');
const crypto = require('cryptography');

getmac.getmacAsync = util.promisify(getmac.getMac);

module.exports = class apiSecretKey {

	constructor(port) {
		this.mac = '';
		this.now = 0;
		this.port = port;
		this.isReady = false;
	}

	async createApiSecret() {
		this.mac = await getmac.getmacAsync().then((mac) => { return mac; }).catch((e) => { throw e; });
		this.now = Date.now();

		// Generate a secret API access key using mac address, now timestamp and sever port number.
		// Key has been left as "secret" as a string this is easy to change to something more secure later on.

		this.key = await crypto.encrypt({
						encryptionAlgorithm: "hmac",
    					key: "secret",
    					data: this.mac + this.now + this.port
					}).then((key) => { return key; })
					.catch((e) => { throw e; });

		this.isReady = true;

		return this.key;
	}
}