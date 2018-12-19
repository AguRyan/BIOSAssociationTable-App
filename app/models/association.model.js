const mongoose = require('mongoose');

const AssociationSchema = mongoose.Schema({
    consumer: String,
    id_consumer: String,
	id_provider: String,
	operation: String,
	internal_use: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Association', AssociationSchema);