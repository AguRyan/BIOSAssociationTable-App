module.exports = (app) => {
    const association = require('../controllers/association.controller.js');

    // Create a new Association
    app.post('/association', association.create);

    // Retrieve all Associations
    app.get('/association', association.findAll);

    // Retrieve a single Association with noteId
    app.get('/association/:id_consumer', association.findOne);

    // Update a Association with noteId
    app.put('/association/:id_consumer', association.update);

    // Delete a Association with noteId
    app.delete('/association/:id_consumer', association.delete);
}