# Arm Tech Challenge

Jamie Hill
29th July 2018
Build a RESTful API with 2 end points, no database and tests to ensure its continued functionality.

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

By encoding the full name and software package to create the key, when it is decrypted the full name can be compared to the one provided in the API request. Lastly, authentication has already been done by the time it comes to decrypt. The API key is used to as the encryption key. So only autherised users would ever be able to decrypt the key to validate the full name.

## Step 6

Acceptance tests. I've build a test generator using a few arrays of sample input data, random numbers to pick indexes and a test data builder that generates an object with the data for each type of test. Axios as a package is then used to call each API generating a key, checking returned status codes and if its good proceed to validate the licence key.