# http-post-automater
Automate http post requests

This is my first npm package so please be kind :)

## Installation
```npm install http-post-automater```

## Usage

```var automate = require("http-post-automater");```

You must define certain properties to start the tests:
* Number of tests to be performed
* Delay between tests (minimum 5 seconds)
* Endpoint to post data to
* Data you require to post
* The parts of the data that will be modified (if at all)

```
var options = {
  number: 10,
  delay: 5
  endpoint: "http://api.co.uk"
  data: {
    name: "John Smith"
  }
}

automate.start(options)
```
