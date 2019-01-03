const Association = require('../models/association.model.js');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.consumer) {
        return res.status(400).send({
            message: "Association consumer can not be empty"
        });
    }
	
	if(!req.body.id_consumer) {
        return res.status(400).send({
            message: "Association id_consumer can not be empty"
        });
    }
	
	if(!req.body.operation) {
        return res.status(400).send({
            message: "Association operation can not be empty"
        });
    }

    // Create a association
    const association = new Association({
        consumer: req.body.consumer || "", 
        id_consumer: req.body.id_consumer || "",
        id_provider: req.body.id_provider || "",
        operation: req.body.operation || "",
        internal_use: req.body.internal_use || ""
    });

    // Save Association in the database
    association.save()
    .then(data => {
        res.send(data);
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
        res.send(associations);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving associations."
        });
    });
};

// Find a single association with a id_consumer or id_provider
exports.findOne = (req, res) => {
 
	
	if(req.query.id_consumer)
	{
		 Association.findOne({ id_consumer: req.query.id_consumer })
		.then(association => {
			if(!association) {
				return res.status(404).send({
					message: "Association not found with id_consumer " + req.query.id_consumer
				});            
			}
			res.send(association);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Association not found with id_consumer " + req.query.id_consumer
				});                
			}
			return res.status(500).send({
				message: "Error retrieving association with id_consumer " + req.query.id_consumer
			});
		});
	}
	else if (req.query.id_provider)
	{
		 Association.findOne({ id_provider: req.query.id_provider })
		.then(association => {
			if(!association) {
				return res.status(404).send({
					message: "Association not found with id_provider " + req.query.id_provider
				});            
			}
			res.send(association);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Association not found with id_provider " + req.query.id_provider
				});                
			}
			return res.status(500).send({
				message: "Error retrieving association with id_provider " + req.query.id_provider
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

// Update a association identified by the id_consumer in the request
exports.update = (req, res) => {
    // Validate Request
	
	if(!req.body.id_provider) {
        return res.status(400).send({
            message: "Association id_provider can not be empty"
        });
    }	
	
	if(!req.body.operation) {
        return res.status(400).send({
            message: "Association operation can not be empty"
        });
    }

    // Find association and update it with the request body
    Association.findOneAndUpdate({ id_consumer: req.params.id_consumer }, {
        id_provider: req.body.id_provider || "",
        operation: req.body.operation || ""
    }, {new: true})
    .then(association => {
        if(!association) {
            return res.status(404).send({
                message: "Association not found with id " + req.params.id_consumer
            });
        }
        res.send(association);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Association not found with id " + req.params.id_consumer
            });                
        }
        return res.status(500).send({
            message: "Error updating association with id " + req.params.id_consumer
        });
    });
};

// Delete a association with the specified associationId in the request
exports.delete = (req, res) => {
    Association.findByIdAndRemove(req.params.associationId)
    .then(association => {
        if(!association) {
            return res.status(404).send({
                message: "Association not found with id " + req.params.associationId
            });
        }
        res.send({message: "Association deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Association not found with id " + req.params.associationId
            });                
        }
        return res.status(500).send({
            message: "Could not delete association with id " + req.params.associationId
        });
    });
};
