/**
* this middleware intercepts all API
* calls that use the path /api/<version>
*/

import logger from 'winston-color'

module.exports = function(req, res, next) {

	// add middleware here (i.e. interceptors)
	logger.warn('MIDDLEWARE: Route intercepted')

	// move to next middleware
    next()
}
