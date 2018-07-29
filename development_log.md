# Arm Tech Challenge

- Jamie Hill
- 29th July 2018
- Build a RESTful API with 2 end points, no database and tests to ensure its continued functionality.

## Step 1

Initially setup the end points, returning a {"service":<name>} json string.

## Step 2

Ensure HTTP request status codes meet specification of 404 not found and 204 on succesful validation and 401 on unautherised.

### Assumption 1

No HTTP status code specificed for successfully generating a licence key, 200 OK will be used.

### Assumption 2

No autherisation type was specifically identified, rather a secret is used. As such I am assuming this is similiar to an API hash key for access and will use a header parameter to send this information.

### Testing

Testing so far has involved PostMan and manually setting up the request headers to verify output results.

## Step 3

Created a secret access key for the api. hmac encrypted string consisting of server mac address, now() timestamp and port number. This value is unique per run of the server.

### Assumption 1

No specification given for how the user will get the API key, so currently this is generated on each run of the server and displayed as console output. I would assume in a production setting this key would be static, otherwise each reboot of the licence server would require a lot of users to be contacted with updated credentials. At present generating a key per server run is secure and works for the purposes of demonstrating authentication to the api.

## Step 4

Generate a licence key for a authenticated user with a full name and software package provided.

### Assumption 1

Full name should be a string, greater than 5 characters long. No spec provided to say what a full name is, if its a first name, middle name and last name or if its one string with the full name. I've gone with one string containing a full name.

### Assumption 2

No software package list has been provided. I am assuming that only real software packages can have a key generated for them, therefore I have create a list of packages that are valid options. These are: "Software Package A"; "Software Package B"; "Software Package C".

I also assume a software package name to be a string, greater than 5 characters long.

### Assumption 3

No specification given for output of licence key, if it should be a json or plain text. I've gone for plain text.

### Assumption 4

What happens on full name or software package name validation failure? I'm returning 404 error code. There is also the possibility of other things going wrong at the generate licence key stage, so if that happens I return a 500 error code.

### Issue 1

Originally I used parameter name "package" for the licenced product, however this is a reserved key word with 'use strict' so I changed to "software"

## Step 5

Validate a licence key. Without database lookup there are 3 options available to store the information to validate a licence key.

1. Files - but if a database is unavailable, would there really be enough disk space?
2. Memory - but everything will be lost when the server restarts. No persistence.
3. Licence Key - since its encrypted, this is where I've stored the validation information.

By encoding the full name and software package to create the key, when it is decrypted the full name can be compared to the one provided in the API request. Lastly, authentication has already been done by the time it comes to decrypt. The API key is used as the encryption key. So only autherised users would ever be able to decrypt the key to validate the full name.

## Step 6

Acceptance tests. I've build a test generator using a few arrays of sample input data, random numbers to pick indexes and a test data builder that generates an object with the data for each type of test. Axios as a package is then used to call each API generating a key, asserting each status codes and if its good proceed to validate the licence key.

Other options are available, such as https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/

During the development process, I had it in my head that the key part of testing this was the API end points and with a deadline, I went ahead with the axios approach to test the API.

With further consideration into Unit tests, a more complete set of tests could have been generated using something like Mocha and not only for the API end points but also for the apiKey and licenceKey class. I have decided to leave my initial axios based test harness in place as to make the changes for mocha or other unit test methods would require that the server be wrapped up in an object that can be started as a standalone server, or as a test asset for unit tests. In an ideal world there would also be a build process that would execute and record test results. Finally, I beleive that the axios approach is a more efficient and complete set of tests, with minimum data and code input. This is in comparision to a mocha style test where each set of invalid inputs would require a new set of tests, repeating code and introducing potential errors in the test process. The flip side is that I wrote more code, which also introduces a larger scope for errors in the test process. 

I am also aware that the apiKey class has only 2 methods. A unit test of this class would require a decryption method to be added (it would make more sense in the class than in a test runner), so that 3 unit tests could be run with one checking port value is populated on construction, and that the encryption method returned a string, and that decrypt could return the original data back. A similar approach for unit tests would be useful for the licenceKey class, with the majority of the test cases asserting a boolean value based on inputs and a string being returned. The real challenge with unit testing the api and licence key classes is that the returned encrypted strings would have to be generated outside of the class to do an equals assert on them, or a decrypt method would be needed to confirm an expected result from an inputted key. These posibilities are all covered by the axios test with 5 test types identified.

1. All valid data
2. Invalid API key
3. Invalid full name
4. Invalid software package
5. Invalid licence key

I didn't see any over lap of test conditions, for example an invalid API key and an invalid licence key would drop out at the first authentication point. Similarly invalid name and software product would result in the same drop out point, so they need to be tested separately.

## Step 7

Re-reading the specification, the part I missed initially was that the licence key should use a secret known only to the API server.

Updated to create a new key from the apiKey class and store this in a licKey const that is now used to generate the licnece key, rather than reusing the API key as originally was the case.