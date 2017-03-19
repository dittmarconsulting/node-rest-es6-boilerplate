export default callback => {

	const dbObj = {
		name: 'mongoDB'
	}
	// connect to a database if needed, then pass it to `callback`:
	callback(dbObj);
}
