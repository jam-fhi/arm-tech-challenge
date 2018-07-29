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