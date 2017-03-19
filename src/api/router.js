import nconf from 'nconf'
import { Router } from 'express'
import crudUser from './crudUser'

export default ({ db }) => {

	let api = Router()

	// mount the facets resource
	api.use('/users', crudUser({ db }))

	// expose API version at the root (/api/<version>/)
	api.get('/', (req, res) => {
		res.json(nconf.get('api:version'))
	});

	return api
}
