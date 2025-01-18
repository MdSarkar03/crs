const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, lowercase: true, unique: true, trim: true},
    phone: {type: String, required: true},
    location: {type: String, required: true},
    password: {type: String, required: true, trim: true},
}, {timestamps: true});

module.exports = mongoose.model('Company', companySchema);