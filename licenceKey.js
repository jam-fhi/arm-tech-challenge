const crypto = require('cryptography');

module.exports = class licenceKey {

	/*

	Nothing to construct

	constructor() {
	
	}

	*/

	async validateLicenceKey(apiKey, licenceKey, fullname) {
		return await crypto.decrypt({
			encryptionAlgorithm: "hmac",
			key: apiKey,
			data: licenceKey
		}).then((decoded) => {

			let valid = false;

			if(decoded.indexOf('####') >= 0) {
				const details = decoded.split('####');
				if(details[0] === fullname) {
					valid = true;
				}
			}

			return valid;

		}).catch((e) => {
			throw e;
		});
	}

	async generateLicenceKey(apiKey, fullname, software) {
	
		if(this.validateLicenceDetails(fullname, software) === true) {
			return await crypto.encrypt({
							encryptionAlgorithm: "hmac",
							key: apiKey,
							data: fullname + '####' + software
						}).then((key) => { return key; })
						.catch((e) => { throw e; });
		} else {
			return 404;
		}
	}

	validateLicenceDetails(fullname, software) {

		if(this.validateFullname(fullname) && this.validatePackage(software)) {
			return true;
		} else {
			return false;
		}
	}

	validateFullname(fullname) {
		/* 

		No spec to say what a full name is.
		Added basic validation to demonstrate the process.

		*/

		let valid = false;

		if(typeof(fullname) === "string") {

			// Random choice of length, no spec.
			if(fullname.length > 5) {

				valid = true;
			}
		}

		return valid;
	}

	validatePackage(software) {
		/* 

		No spec to say what a package is.
		Added basic validation to demonstrate the process.
		I would expect in a production setting there would
		be a predefined list of acceptable packages.

		I've made up few.

		*/

		let valid = false;

		if(typeof(software) === "string") {

			// Random choice of length, no spec.
			if(software.length > 5) {

				if(	software === 'Software Package A' ||
					software === 'Software Package B' || 
					software === 'Software Package C') {
					valid = true;
				}
			}
		}

		return valid;
	}
}