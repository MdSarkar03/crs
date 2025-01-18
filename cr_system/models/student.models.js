const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    phone: { type: String, required: true },
    DOB:   { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true },
    college: { type: String, required: true },
    semester: { type: String, required: true },
    GPA:      { type: String, required: true },
    password: { type: String, reuired: true, trim: true },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
}, {timestamps: true});

module.exports = mongoose.model('Student', studentSchema);