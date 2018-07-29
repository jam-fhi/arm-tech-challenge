const axios = require('axios');
const chai = require('chai');  
const expect = chai.expect;

const apiKey = 'NiGkiXWrQSzbPkZGCPkDHCZDh5eE3ilJQwIJk5PYvSi5mF/4dqaPBhcoggckcWUb';

const firstNames = ["John", "Bob", "Jack", "Michael"];
const lastNames = ["Smith", "McEwen", "Partridge", "Reeves"];
const software = ["Software Package A", "Software Package B", "Software Package C"];
const wrongSoftware = ["Package A", "Not A Package", "sdflkw32"];
const testTypeName = ['', '', 'Valid Data', '', 'Invalid Software Package', 'Invalid API Key', 'Invalid Licence Key', 'Invalid Name'];

let testType = {};
testType.valid = 2;
testType.invalidName = 7;
testType.invalidSoftware = 4;
testType.invalidKey = 5;
testType.invalidLicence = 6;

async function testRunner() {
	// How many tests to run?
	const testTotal = 15;
	let testCount = 0;
	while(testCount < testTotal) {

		let runTest = 0;
		
		let testTypeSelected = getTestType(testCount);
		let testData = buildTestData(testTypeSelected);

		console.log('\n\n');

		await generateLicenceKey(testData.apiKey, testData.fullname, testData.package).then(async (result) => {

			console.log(testTypeName[testTypeSelected] + ' Test Running...');
			console.log('Test Data', testData);
			console.log('Test Result: ', result);
			expect(result.status).to.equal(testData.genExpected);
			if(	testTypeSelected === testType.invalidKey ||
				testTypeSelected === testType.valid ||
				testTypeSelected === testType.invalidLicence) {

				if(testTypeSelected === testType.valid) {
					// Make sure we use valid data in valid test case.
					testData.licence = result.data;
				}

				console.log('Running validate licence test with data', testData.apiKey, testData.licence, testData.fullname);

				await validateLicenceKey(testData.apiKey, testData.licence, testData.fullname).then((result) => {
					console.log('Validate licence key expected result', testData.validExpected);
					console.log('Validate licence key actual result', result);
					expect(result).to.equal(testData.validExpected);
				}).catch((e) => {
					console.log(e);
				})
			}
		}).catch((e) => {
			console.log(e);
		});
		testCount++;
	}
}

async function validateLicenceKey(useKey, licKey, fullname) {
	return await axios.get('http://localhost:3000/api/validateLicenceKey', { headers: { key: useKey, fullname: fullname, licence: licKey}})
	.then((res) => {
		return res.status;
	}).catch((e) => {
		return e.response.status;
	})
}

async function generateLicenceKey(useKey, fullname, package) {
	return await axios.get('http://localhost:3000/api/genLicenceKey', { headers: { key: useKey, fullname: fullname, package: package}})
	.then((res) => {
		if(res.status === 200) {
			// When it is a valid request, we expect a string licence key.
			return {data: res.data, status: res.status};
		} else {
			return {data: '', status: res.status};
		}
	}).catch((e) => {
		return {data: '', status: e.response.status};
	})
}

function buildTestData(testSelection) {
	let testData = {};
	testData.fullname = firstNames[getRandomIndex(firstNames.length)] + ' ' + lastNames[getRandomIndex(lastNames.length)];
	testData.package = software[getRandomIndex(software.length)];
	testData.licence = '';
	testData.apiKey = apiKey;
	testData.genExpected = 200;
	testData.validExpected = 204;

	if(testSelection === testType.invalidName) {

		testData.fullname = firstNames[getRandomIndex(firstNames.length)];
		if(testData.fullname.length > 4) {
			testData.fullname = testData.fullname.substring(0, 4);
		}
		testData.genExpected = 404;

	} else if(testSelection === testType.invalidSoftware) {

		testData.package = wrongSoftware[getRandomIndex(wrongSoftware.length)];
		testData.genExpected = 404;

	} else if(testSelection === testType.invalidKey) {

		testData.apiKey = 'this-is-not-a-valid-api-key';
		testData.genExpected = 401;
		testData.validExpected = 401;

	} else if(testSelection === testType.invalidLicence) {

		testData.licence = 'this-is-not-a-valid-licence';
		testData.validExpected = 404;

	}

	return testData;
}

function getRandomIndex(max) {
	let random = Math.floor(Math.random() * 100);
	while(random <= 0 || random >= max) {
		random = Math.floor(Math.random() * 100);
	}
	return random;
}

function getTestType(testCount) {
	if(testCount % testType.invalidName === 0) {

		return testType.invalidName;

	} else if(testCount % testType.invalidSoftware === 0) {

		return testType.invalidSoftware;

	} else if(testCount % testType.invalidKey === 0) {

		return testType.invalidKey;

	} else if(testCount % testType.invalidLicence === 0) {

		return testType.invalidLicence;

	} else {

		return testType.valid;
		
	}
}

// Run the tests.
testRunner();