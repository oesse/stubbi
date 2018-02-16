# stubbi - http server to stub http requests
[![Build Status](https://travis-ci.org/oesse/stubbi.svg?branch=master)](https://travis-ci.org/oesse/stubbi)

## Features

* Setup stubs via REST `POST /stubs`
* Get details about calls made to stubs `GET /stubs/:id` including
  * call count
  * request headers, query parameters, http body for each call
* respond with custom response headers, status code, body
* notify some other http endpoint when stub is hit (use [request](https://npmjs.com/packages/request) API)
