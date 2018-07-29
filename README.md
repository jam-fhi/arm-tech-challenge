# Engineering Technical Test : API Development

## Overview

The purpose of this technical test is to gauge an applicants ability to produce a restful API from a
given specification.

We would like the candidate to build an API endpoint in the programming language of choice that
conforms to the following specification.

The expected deliverables are:
- Code to achieve the following specification.
- Documentation to detail any assumption or difficulties.

## Specification

### Introduction

As a software company we would like to create a secure method of generating and validating
software license keys. For the purpose of this test, user authentication is not required.
We have limited resources and cannot dedicate any database storage to this application.

User Stories

1. As a member of the software licensing company I need to be able to generate, via an API, a
unique value to be used as a license key.
a. I need this endpoint to require an authentication secret to prevent others from
generating their own license keys

2. As a consumer of a software product I need to be able to have my license key be verified via
an API.
Implementation Details
• You may not store the license keys in a database
• Each API endpoint must be tested using a suitable method
License Key Generation
• Please choose a secure cryptographic hashing function to generate the license key
• Please use a combination of the information provided by the request and a secret known only to
the API to generate the license key

### Functional Requirements

1. Creating a license key
a. This API endpoint must accept:
i. The full name of the end-user
ii. The name of the software package
iii. A secret to validate the API access it from an authenticated user

b. This API endpoint must return
i. A secure key based off of the given inputs and internal private key
ii. A HTTP 401 Unauthorized response if the secret hasn't been provided or is
incorrect
2. Validating a license key
a. This API endpoint must accept
i. The full name of the end-user
ii. The license key they wish to validate
b. This API must return
i. A HTTP 204 response on successful license key validation
ii. A HTTP 404 response if the license key validation fails