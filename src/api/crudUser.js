import resource from 'resource-router-middleware'
import logger from 'winston-color'
import users from '../models/users'

export default ({ db }) => resource({

	mergeParams: true,

	/** Property name to store preloaded entity on `request`. */
	id : 'user',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let user = users.find( user => user.id === id ),
			err = user ? null : 'Not found'
		callback(err, user);
	},

	/** GET /api/<version>/users/ - List all entities */
	index({ params }, res) {
		logger.info('RETURN all users')
		res.json(users);
	},

	/** POST /api/<version>/ - Create a new entity */
	create({ body }, res) {
		logger.info('CREATE a new user', body)
		let nextId = parseInt(users.length, 10) + 1
		body.id = nextId.toString()
		users.push(body)
		res.json(body)
	},

	/** GET /api/<version>/users/4 - Return a given entity */
	read({ user }, res) {
		logger.info('RETURN a user by ID')
		res.json(user);
	},

	/** PUT /api/<version>/users/4 - Update a given entity */
	update({ user, body }, res) {
		logger.info('UPDATE a user by ID', body)
		for (let key in body) {
			if (key!=='id') {
				user[key] = body[key];
			}
		}
		res.sendStatus(204)
	},

	/** DELETE /api/<version>/users/4 - Delete a given entity */
	delete({ user }, res) {
		logger.info('UPDATE a user by id')
		users.splice(users.indexOf(user), 1)
		res.sendStatus(204)
	}
});
