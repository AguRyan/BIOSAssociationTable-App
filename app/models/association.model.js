const mongoose = require('mongoose');

const AssociationSchema = mongoose.Schema({
	_id: String,
	consumer: String,
	idProvider: String,
	operation: String,
	internalUse: String,
}, {
    timestamps: true,
	versionKey: false
});

module.exports = mongoose.model('Association', AssociationSchema);