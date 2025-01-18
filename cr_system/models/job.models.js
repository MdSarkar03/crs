const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    vacancy: {type: Number, required: true},
    salary: {type: Number, required: true},
    lastDate: {type: Date, required: true},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
}, {timestamps: true});

module.exports = mongoose.model('Job', jobSchema);