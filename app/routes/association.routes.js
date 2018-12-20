module.exports = (app) => {
	
	
    const association = require('../controllers/association.controller.js');
	const user=process.env.ASSOCIATION_USER;
	const pass=process.env.ASSOCIATION_PASSWORD;
	
	var staticUserAuth = basicAuth({
		users: {
			user : pass
		},
		challenge: false,
		unauthorizedResponse: getUnauthorizedResponse
	});

    // Create a new Association
    app.post('/association',staticUserAuth, association.create);

    // Retrieve all Associations
    app.get('/association',staticUserAuth, association.findAll);

    // Retrieve a single Association with noteId
    app.get('/association/:id_consumer',staticUserAuth, association.findOne);

    // Update a Association with noteId
    app.put('/association/:id_consumer',staticUserAuth, association.update);

    // Delete a Association with noteId
    app.delete('/association/:id_consumer',staticUserAuth, association.delete);
	
	function getUnauthorizedResponse(req) {
		return req.auth ? {"message":"Credentials with user" + req.auth.user + " rejected"} : {"message" : "No credentials provided"}
}
}