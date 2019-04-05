# http-post-automater
Automate http post requests

This is my first npm package so please be kind :)

## Installation
```npm install http-post-automater```

## Usage

```var automate = require("http-post-automater");```

You must define certain properties to start the tests:
* Number of tests to be performed
* Delay between tests (minimum 1 second)
* Endpoint to post data to
* Data you require to post
* The parts of the data that will be modified (if at all)

```
var options = {
  number: 10,
  delay: 1
  endpoint: "http://api.co.uk"
  data: {
    name: "John Smith"
  }
}

automate.start(options)
```

You can also add a numerical identifier to each property in your data. This will simply increment a number in place of this placeholder. This means you can post different data for each test.

```
var options = {
  number: 3,
  delay: 1,
  endpoint: "http://api.co.uk",
  data: {
    email: "<% numerical %>@gmail.com"
  }
}

automate.start(options)
```

This will post the following
* 0@gmail.com
* 1@gmail.com
* 2@gmail.com
