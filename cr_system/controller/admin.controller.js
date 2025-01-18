const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin.models');
const Company = require('../models/company.models');
const Student = require('../models/student.models');
const Job = require('../models/job.models');

exports.admin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            const admin = new Admin({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
            });
            await admin.save();
            console.log('Default admin created');
        } else {
            console.log('Default admin already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.render('admin/signin', {error: 'Invalid email or password!'});
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) { 
            return res.render('admin/signin', {error: 'Invalid email or password!'});
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.redirect('/admin/dashboard');
    } 
    catch (error) {
        res.render('admin/signin', {error: 'Something went wrong, Please try again!'});
    }
};

exports.dashboard = async (req, res) => {
    try{
        const companies = await Company.find({});
        const students = await Student.find({});
        const jobs = await Job.find().populate('companyId', 'name').exec();
        res.render('admin/dashboard', {companies, students, jobs});
    }
    catch(error) {
        res.status(500).send('Something went wrong!');
    }
}

exports.getCompanies = async (req, res) => {
    try{
        const companies = await Company.find({});
        res.status(200).json(companies);
    }
    catch(error){
        res.status(500).send('Failed to fetch companies');
    }
}

exports.getStudents = async (req, res) => {
    try{
        const students = await Student.find({});
        res.status(200).json(students);
    }
    catch(error){
        res.status(500).send('Failed to fetch students');
    }
}

exports.getJobs = async (req, res) => {
    try{
        const jobs = await Job.find({}).populate('companyId');
        res.json(jobs);
    }
    catch(error){
        res.status(500).send('Failed to fetch jobs');
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCompany = await Company.findByIdAndDelete(id);
        if (deletedCompany) {
            res.status(200).json({ message: 'Company deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Company not found.' });
        }
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (deletedStudent) {
            res.status(200).json({ message: 'Student deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Student not found.' });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}