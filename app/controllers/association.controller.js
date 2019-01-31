const Association = require('../models/association.model.js');
const glogger = require('../../config/graylog.config.js');

exports.create = (req, res) => {
    // Validate request
	glogger(6,"POST Request: "+ JSON.stringify(req.body),req.headers.messageid);
    if(!req.body.consumer) {
		glogger(3,"Association consumer can not be empty",req.headers.messageid);
        return res.status(400).send({
            message: "Association consumer can not be empty"
        });
    }
	
	if(!req.body.idConsumer) {
		glogger(3,"Association idConsumer can not be empty",req.headers.messageid);
        return res.status(400).send({
            message: "Association idConsumer can not be empty"
        });
    }
	
	if(!req.body.operation) {
		glogger(3,"Association opeartion can not be empty",req.headers.messageid);
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
		glogger(6,"POST OK",req.headers.messageid);
        res.send(JSON.parse(JSON.stringify(data).split('"_id":').join('"idConsumer":')));
    }).catch(err => {
		glogger(3,err.message || "Some error occurred while creating the Association.",req.headers.messageid);
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
		glogger(3,err.message || "Some error occurred while creating the Association.",req.headers.messageid);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving associations."
        });
    });
};

// Find a single association with a idConsumer or with idProvider
exports.findOne = (req, res) => {

	
	if(req.query.idConsumer)
	{
		glogger(6,"GET Request: ?idConsumer="+ req.query.idConsumer,req.headers.messageid);
		 Association.findById(req.query.idConsumer)
		.then(association => {
			if(!association) {
				glogger(3,"Association not found with idConsumer " + req.query.idConsumer,req.headers.messageid);
				return res.status(404).send({
					message: "Association not found with idConsumer " + req.query.idConsumer
				});            
			}
						
			glogger(6,"GET OK",req.headers.messageid);
			res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				glogger(3,"Association not found with idConsumer " + req.query.idConsumer,req.headers.messageid);
				return res.status(404).send({
					message: "Association not found with idConsumer " + req.query.idConsumer
				});                
			}
			glogger(3,"Error retrieving association with idConsumer " + req.query.idConsumer,req.headers.messageid);
			return res.status(500).send({
				message: "Error retrieving association with idConsumer " + req.query.idConsumer
			});
		});
	}
	else if (req.query.idProvider)
	{
		glogger(6,"GET Request: ?idProvider="+ req.query.idProvider,req.headers.messageid);
		 Association.findOne({ idProvider: req.query.idProvider })
		.then(association => {
			if(!association) {
				glogger(3,"Association not found with idProvider " + req.query.idProvider,req.headers.messageid);
				return res.status(404).send({
					message: "Association not found with idProvider " + req.query.idProvider
				});            
			}
			glogger(6,"GET OK",req.headers.messageid);
			association.idConsumer = association._id;
			res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				glogger(3,"Association not found with idProvider " + req.query.idProvider,req.headers.messageid);
				return res.status(404).send({
					message: "Association not found with idProvider " + req.query.idProvider
				});                
			}
			glogger(3,"Error retrieving association with idProvider " + req.query.idProvider,req.headers.messageid);
			return res.status(500).send({
				message: "Error retrieving association with idProvider " + req.query.idProvider
			});
		});
	}
	else
	{
		glogger(6,"GET Request: "+ JSON.stringify(req.query),req.headers.messageid);
		glogger(3,"Bad query parameters",req.headers.messageid);
		return res.status(400).send({
                message: "Bad query parameters"
            });
	}
		
	
 
};

// Update a association identified by the idConsumer in the request
exports.update = (req, res) => {
    // Validate Request
	glogger(6,"PUT Request: "+req.params.idConsumer +" " + JSON.stringify(req.body),req.headers.messageid);
	
	if(!req.body.idProvider) {
		glogger(3,"Association idProvider can not be empty",req.headers.messageid);
        return res.status(400).send({
            message: "Association idProvider can not be empty"
        });
    }	
	
	if(!req.body.operation) {
		glogger(3,"Association operation can not be empty",req.headers.messageid);
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
			glogger(3,"Association not found with id " + req.params.idConsumer,req.headers.messageid);
            return res.status(404).send({
                message: "Association not found with id " + req.params.idConsumer
            });
        }
		glogger(6,"PUT OK",req.headers.messageid);
        res.send(JSON.parse(JSON.stringify(association).split('"_id":').join('"idConsumer":')));
    }).catch(err => {
		glogger(3,"Association not found with id " + req.params.idConsumer,req.headers.messageid);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Association not found with id " + req.params.idConsumer
            });                
        }
		glogger(3,"Error updating association with id " + req.params.idConsumer,req.headers.messageid);
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
			glogger(3,"No association to delete with operation: ELI",req.headers.messageid);
            return res.send({
                message: "No association to delete with operation: ELI"
            });
        }
		glogger(6,"Associations with operation: ELI deleted successfully!",req.headers.messageid);
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
