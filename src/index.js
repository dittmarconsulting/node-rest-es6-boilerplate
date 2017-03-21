let app = express()
import http from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import winston from 'winston'
import logger from 'winston-color'
import expressWinston from 'express-winston'
import { Mail } from 'winston-mail'
import bodyParser from 'body-parser'
import nconf from 'nconf'

import config from './config.json'
import initializeDb from './db'
import middleware from './middleware'
import router from './api/router'

/* --------------------------
	create server
--------------------------- */

app.server = http.createServer(app)

/* --------------------------
	nconf setup

		Hierarchical configuration
		1. nconf.argv(options) Loads process.argv using yargs. If options is supplied it is passed along to yargs.
		2. nconf.env(options) Loads process.env into the hierarchy.
		3. nconf.file(options) Loads the configuration data at options.file into the hierarchy.
		4. nconf.defaults(options) Loads the data in options.store into the hierarchy.
		5. nconf.overrides(options) Loads the data in options.store into the hierarchy.

--------------------------- */

// commandline alias - higher priority than env
// (i.e npm run dev -p 15000)
nconf.argv({
	p: {
		alias: 'http:port',
		describe: 'The port is listening on'
	}
})

// command line options - higher priority than file
// (i.e http__port=8001 npm run dev)
nconf.env('__')

// nconf file has a higher priority than the defaults
nconf.file('./src/config.json')

// using nconf defaults
nconf.defaults({
	http: {
		port: 8000
	},
	bodyLimit: '100kb',
	cors : {
		origin: "*",
		methods : ["GET,HEAD,PUT,PATCH,POST,DELETE"],
		corsHeaders : ["Link, Content-type, Accept, X-Access-Token, X-Key, cache-control"],
		preflightContinue : true
	},
	logger: {
		level: 'error'
	},
	api : {
		version : 'API Version 1',
		path: '/api/v1/'
	}
})

/* --------------------------
	winston logger setup

	log an info - winston.info('Something went wrong!')
	log an waring - winston.warn('This is a warning!')
	log an error - winston.error(Something went wrong!)
	log a time in between - winston.profile('test') <code> winston.profile('test')
--------------------------- */

// set up logging to file
winston.add(winston.transports.File, {
	filename: './logs/error.log',
	level: nconf.get('logger:level')
})

/*
	logger.error(<red>)
	logger.warn(<yellow>)
	logger.info(<green>)
	logger.debug(<blue>)
*/


/* --------------------------
	winston-mail setup
		send all logs to your email
--------------------------- */

// send logs (i.e. errors to provided email)
// winston.add(winston.transports.Mail, {
// 	to: 'test@test.com',
// 	username: 'smpt_username',
// 	password: 'smpt_password',
// 	level: 'error',
// 	ssl: true,
// 	level: 'error',
// 	authentication : {
// 		XOAuth2:{
// 			user: // Gmail address ,
// 			clinetId: "CLient ID ",
// 			clientSecret: "Clinet Secret",
// 			refreshToken:"Refresh Token"
// 	}
// })

/* --------------------------
	winston-express setup
		log all HTTP requests and responses
--------------------------- */

app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: false
        })
      ],
      meta: false, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false } // optional: allows to skip some log messages based on request and/or response
  }))

  /* --------------------------
  	HELMET setup
  --------------------------- */

  // set standard headers
  // to set specific headers read here: https://github.com/helmetjs/helmet
  app.use(helmet())

/* --------------------------
	CORS setup
--------------------------- */

// CORS middleware
app.use(cors(nconf.get('cors')))

/* --------------------------
	Body parser setup
--------------------------- */

app.use(bodyParser.json({
	limit : nconf.get('bodyLimit')
}))
//app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
//app.use(bodyParser.text()); // allows bodyParser to look at raw text

/* --------------------------
	DB connection, middleware & router setup
--------------------------- */

// store the server Object so we can close it in the unit tests
let server = null

// connect to db
initializeDb( db => {

	// internal middleware
	app.all(nconf.get('api:path') + '*', [middleware])

	// api router
	app.use(nconf.get('api:path'), router({ db }))

	// start server
	server = app.server.listen(process.env.PORT || nconf.get('http:port'))

	// log the start
	logger.debug(`Server started on port ${app.server.address().port}`)
})

// provide a close function for uinit tests
app.close = () => {
	if(server) {
		server.close()
		logger.debug('Server has stopped!')
	}

}

export default app
