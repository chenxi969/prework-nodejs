"use strict";
let http = require('http')
let fs = require('fs')
let request = require('request')
let child_process = require('child_process')

let argv = require('yargs')
    .usage("Usage: node ./$0 [options]")
    .example("node index.js -p 8001 -h google.com")
    .alias('p', 'port')
    .alias('x', 'host')
    .alias('e', 'exec')
    .alias('l', 'log')
    .describe('p', 'Specify a forwarding port')
    .describe('x', 'Specify a forwarding host')
    .describe('e', 'Specify a process to proxy instead')
    .describe('l', 'Specify a output log file')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2015')
    .argv

if (argv.exec){
	let cmd = argv.exec
	let args = argv._
	child_process.spawn(cmd, args, { stdio: 'inherit' })
	process.exit()
}

let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout
let localhost = '127.0.0.1'
let scheme = 'http://'
let host = argv.host || localhost
let port = argv.port || (host == localhost ? 8000 : 80)
let destinationUrl = scheme + host + ':' + port


let echoServer = http.createServer( (req, res) => {

  logStream.write('echoServer\n')
  for (let header in req.headers){
  	res.setHeader(header, req.headers[header])
  }
  logStream.write(JSON.stringify(req.headers)+'\n')
  req.pipe(res)

})
echoServer.listen(8000)
logStream.write('echoServer listening @ 127.0.0.1:8000\n')

let proxyServer = http.createServer( (req, res) => {

  logStream.write('proxyServer\n')
  logStream.write(JSON.stringify(req.headers)+'\n')

  let url = destinationUrl
  if (req.headers['x-destination-url']){
  	url = 'http://' + req.headers['x-destination-url']
  }

  let options ={
  	url: url + req.url
  }

  req.pipe(request(options)).pipe(res)

})
proxyServer.listen(9000)

logStream.write('proxyServer listening @ 127.0.0.1:9000\n')


