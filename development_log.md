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