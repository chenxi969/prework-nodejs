# prework Proxy Server

This is a Proxy Server for Node.js submitted as the [pre-work](http://courses.codepath.com/snippets/intro_to_nodejs/prework) requirement for CodePath.

Time spent: [3]

Completed:

* [*] Required: Requests to port `8000` are echoed back with the same HTTP headers and body
* [*] Required: Requests/reponses are proxied to/from the destination server
* [*] Required: The destination server is configurable via the `--host`, `--port`  or `--url` arguments
* [*] Required: The destination server is configurable via the `x-destination-url` header
* [*] Required: Client requests and respones are printed to stdout
* [*] Required: The `--logfile` argument outputs all logs to the file specified instead of stdout
* [*] Optional: The `--exec` argument proxies stdin/stdout to/from the destination program
* [] Optional: The `--loglevel` argument sets the logging chattiness
* [] Optional: Supports HTTPS
* [*] Optional: `-h` argument prints CLI API

Walkthrough Gif:
[Add walkthrough.gif to the project root]

![Video Walkthrough](walkthrough.gif)


## Starting the Server

```bash
demon index.js
```

## Features

### Echo Server:

```bash
curl http://127.0.0.1:8000/ -H 'foo: bar' -v
* Hostname was NOT found in DNS cache
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8000 (#0)
> GET / HTTP/1.1
> User-Agent: curl/7.37.1
> Host: 127.0.0.1:8000
> Accept: */*
> foo: bar
> 
< HTTP/1.1 200 OK
< user-agent: curl/7.37.1
< host: 127.0.0.1:8000
< accept: */*
< foo: bar
< Date: Fri, 11 Mar 2016 09:17:58 GMT
< Connection: keep-alive
< Content-Length: 0
< 
* Connection #0 to host 127.0.0.1 left intact
hello world
```

### Proxy Server:

Port 9000 will proxy to the echo server on port 8000.

```bash
curl http://127.0.0.1:9000 -d "hello world" -H 'foo: bar' -v
* Rebuilt URL to: http://127.0.0.1:9000/
* Hostname was NOT found in DNS cache
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 9000 (#0)
> POST / HTTP/1.1
> User-Agent: curl/7.37.1
> Host: 127.0.0.1:9000
> Accept: */*
> foo: bar
> Content-Length: 11
> Content-Type: application/x-www-form-urlencoded
> 
* upload completely sent off: 11 out of 11 bytes
< HTTP/1.1 200 OK
< host: 127.0.0.1:8000
< user-agent: curl/7.37.1
< accept: */*
< foo: bar
< content-length: 11
< content-type: application/x-www-form-urlencoded
< connection: close
< date: Fri, 11 Mar 2016 09:14:47 GMT
< 
* Closing connection 0
hello world
```

### Configuration:

#### CLI Arguments:

The following CLI arguments are supported:

##### `--host`

The host of the destination server. Defaults to `127.0.0.1`.

##### `--port`

The port of the destination server. Defaults to `80` or `8000` when a host is not specified.

##### `--url`

A single url that overrides the above. E.g., `http://www.google.com`

##### `--logfile`

Specify a file path to redirect logging to.

#### Headers

The follow http header(s) are supported:

##### `x-destination-url`

Specify the destination url on a per request basis. Overrides and follows the same format as the `--url` argument.
