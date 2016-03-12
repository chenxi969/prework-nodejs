"use strict";
let http = require('http')
let fs = require('fs')
let request = require('request')
let child_process = require('child_process')
let format = require('string-format')
let chalk = require('chalk');

format.extend(String.prototype)

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
let loglevel = argv.loglevel || 'info'


let echoServer = http.createServer( (req, res) => {

  log('info','echoServer\n')
  for (let header in req.headers){
  	res.setHeader(header, req.headers[header])
  }
  log('debug', JSON.stringify(req.headers)+'\n')
  req.pipe(res)

})
echoServer.listen(8000)
log('info', 'echoServer listening @ 127.0.0.1:8000\n')

let proxyServer = http.createServer( (req, res) => {

  log('info','proxyServer\n')
  log('debug', JSON.stringify(req.headers)+'\n')

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

log('info', 'proxyServer listening @ 127.0.0.1:9000\n')


function log(level, msg) {
	let level_map = {
	'emerg': 0,
	'alert': 1,
	'crit': 2,
	'err': 3,
	'warning': 4,
	'notice': 5,
	'info': 6,
	'debug': 7
  }
  let level_color = {
  'emerg': chalk.bold.red,
	'alert': chalk.bold.red,
	'crit': chalk.bold.red,
	'err': chalk.bold.red,
	'warning': chalk.yellow,
	'notice': chalk.yellow,
	'info': chalk.green,
	'debug': chalk.green
  }
  // Compare level to loglevel
  if (level_map[level] <= level_map[loglevel]){
  	if (typeof msg === 'string'){
  		// Is msg a string? => Output it
  		msg = msg
  	}
  	else{
  		// Is msg a string? => Stream it
  		msg = JSON.stringify(msg)
  	}
  	logStream.write(level_color[level]("[{0}]-[{1}]-[{2}]: {3}".format(argv["$0"], JSON.stringify(Date()), level.toUpperCase(), msg)))
  } 
  
}


