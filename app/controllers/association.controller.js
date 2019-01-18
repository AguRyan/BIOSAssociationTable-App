const Association = require('../models/association.model.js');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.consumer) {
        return res.status(400).send({
            message: "Association consumer can not be empty"
        });
    }
	
	if(!req.body.idConsumer) {
        return res.status(400).send({
            message: "Association idConsumer can not be empty"
        });
    }
	
	if(!req.body.operation) {
        return res.status(400).send({
            message: "Association operation can not be empty"
        });
    }

    // Create a association
    const association = new Association({
        _id: req.body.idConsumer,
		consumer: req.body.consumer || "", 
        idProvider: req.body.idProvider || "",
        operation: req.body.operation || "",
        internalUse: req.body.internalUse || ""
    });

    // Save Association in the database
    association.save()
    .then(data => {
        res.send(JSON.parse(JSON.stringify(data).split('"_id":').join('"idConsumer":')));
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Association."
        });
    });
};

// Retrieve and return all associations from the database.
exports.findAll = (req, res) => {
    Association.find()
    .then(associations => {
        res.send(JSON.parse(JSON.stringify(associations).split('"_id":').join('"idConsumer":')));
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving associations."
        });
    });
};

// Find a single association with a idConsumer or with idProvider
exports.findOne = (req, res) => {

	
	if(req.query.idConsumer)
	{
		 Association.findById(req.query.idConsumer)
		.then(association => {
			if(!association) {
				return res.status(404).send({
					message: "Association not found with idConsumer " + req.query.idConsumer
				});            
			}
						
			
			res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Association not found with idConsumer " + req.query.idConsumer
				});                
			}
			return res.status(500).send({
				message: "Error retrieving association with idConsumer " + req.query.idConsumer
			});
		});
	}
	else if (req.query.idProvider)
	{
		 Association.findOne({ idProvider: req.query.idProvider })
		.then(association => {
			if(!association) {
				return res.status(404).send({
					message: "Association not found with idProvider " + req.query.idProvider
				});            
			}
			association.idConsumer = association._id;
			res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Association not found with idProvider " + req.query.idProvider
				});                
			}
			return res.status(500).send({
				message: "Error retrieving association with idProvider " + req.query.idProvider
			});
		});
	}
	else
	{
		return res.status(400).send({
                message: "Bad query parameters"
            });
	}
		
	
 
};

// Update a association identified by the idConsumer in the request
exports.update = (req, res) => {
    // Validate Request
	
	if(!req.body.idProvider) {
        return res.status(400).send({
            message: "Association idProvider can not be empty"
        });
    }	
	
	if(!req.body.operation) {
        return res.status(400).send({
            message: "Association operation can not be empty"
        });
    }

    // Find association and update it with the request body
    Association.findByIdAndUpdate(req.params.idConsumer, {
        idProvider: req.body.idProvider || "",
        operation: req.body.operation || ""
    }, {new: true})
    .then(association => {
        if(!association) {
            return res.status(404).send({
                message: "Association not found with id " + req.params.idConsumer
            });
        }
        res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Association not found with id " + req.params.idConsumer
            });                
        }
        return res.status(500).send({
            message: "Error updating association with id " + req.params.idConsumer
        });
    });
};

// Delete a association with the specified associationId in the request
exports.deleteByOperation = (req, res) => {
    Association.deleteMany({ operation: "ELI" })
    .then(association => {
        if(!association) {
            return res.send({
                message: "No association to delete with operation: ELI"
            });
        }
        res.send({message: "Associations with operation: ELI deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Association not found with id " + req.params.idConsumer
            });                
        }
        return res.status(500).send({
            message: "Could not delete association with id " + req.params.idConsumer
        });
    });
};
