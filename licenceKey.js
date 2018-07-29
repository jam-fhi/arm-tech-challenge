const crypto = require('cryptography');

module.exports = class licenceKey {

	constructor() {
		this.seperator = '####';
	}

	async validateLicenceKey(apiKey, licenceKey, fullname) {
		return await crypto.decrypt({
			encryptionAlgorithm: "hmac",
			key: apiKey,
			data: licenceKey
		}).then((decoded) => {

			let valid = false;

			if(decoded.indexOf(this.seperator) >= 0) {
				const details = decoded.split(this.seperator);
				if(details[0] === fullname) {
					valid = true;
				}
			}

			return valid;

		}).catch((e) => {
			return false;

			/*
				I've commented out this throw as it comes from
				an "final block length" error. While this is an
				error, it only happens with an invalid key to 
				decrypt. I therefore return false, which reports
				back to the end user that the process failed.
			*/
			//throw e;
		});
	}

	async generateLicenceKey(apiKey, fullname, software) {
	
		if(this.validateLicenceDetails(fullname, software) === true) {
			return await crypto.encrypt({
							encryptionAlgorithm: "hmac",
							key: apiKey,
							data: fullname + this.seperator + software
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