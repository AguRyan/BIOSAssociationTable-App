module.exports = (app) => {
	
	const basicAuth = require('express-basic-auth');
    const association = require('../controllers/association.controller.js');
	
	var authorizerAuth = basicAuth({
    authorizer: myAuthorizer,
	challenge: false,
	unauthorizedResponse: getUnauthorizedResponse
	})

    // Create a new Association
    app.post('/association',authorizerAuth, association.create);

    // Retrieve all Associations
    app.get('/association',authorizerAuth, association.findAll);

    // Retrieve a single Association with noteId
    app.get('/association/:id_consumer',authorizerAuth, association.findOne);

    // Update a Association with noteId
    app.put('/association/:id_consumer',authorizerAuth, association.update);

    // Delete a Association with noteId
    app.delete('/association/:id_consumer',authorizerAuth, association.delete);
	
	function myAuthorizer(username, password) {
		return username == process.env.ASSOCIATION_USER && password == process.env.ASSOCIATION_PASSWORD
	}

	function getUnauthorizedResponse(req) {
		return req.auth ? {"message":"Credentials with user " + req.auth.user + " rejected"} : {"message" : "No credentials provided"}
	}
}
