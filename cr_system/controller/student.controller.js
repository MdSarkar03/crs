const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/student.models');
const Job = require('../models/job.models');
const Company = require('../models/company.models');

exports.signup = async (req, res) => {
    try{
        const {name, email, phone, DOB, gender, address, college, semester, GPA, password } = req.body;

        const DOBasObj = new Date(DOB.split('/').reverse().join('-'));
        const hashPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            name,
            email,
            phone,
            DOB: DOBasObj,
            gender,
            address,
            college,
            semester,
            GPA,
            password: hashPassword
        });
        await newStudent.save();

        res.render('partials/signup-success', {
            message: 'Sign up Successful! Now you can sign in.',
            redirectUrl: '/student/signin'
        });
    }
    catch(error) {
        res.status(500).send('Error signing up: '+ error.message);
    }
}

exports.signin = async (req,res) => {
    try{
        const{ email, password} = req.body;
        const student = await Student.findOne({email});
        if(!student) {
            return res.render('student/signin', {error: 'Invalid email or password!'});
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if(!isMatch) {
            return res.render('student/signin', {error: 'Invalid email or password!'});
        }

        const token = jwt.sign(
            { id: student._id, name: student.name, email: student.email, phone: student.phone, DOB: student.DOB,  gender: student.gender, address: student.address, college: student.college, semester: student.semester, GPA: student.GPA }, 
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );
        
        res.cookie('auth_token', token, {httpOnly: true, maxAge: 3600000});
        res.redirect('/student/dashboard');
    }
    catch(error) {
        res.render('student/signin', {error: 'Something went wrong, Please try again!'});
    }
}

exports.dashboard = async (req, res) => {
    try{
        const student = await Student.findById(req.student.id).populate({path: 'appliedJobs', 
            populate: {path: 'companyId', select: 'name'}
        });
        if (!student) {
            return res.redirect('/student/signin');
        }
        const jobs = await Job.find().populate('companyId', 'name').exec();
        const showJobs = req.query.showJobs === 'true';
        const validJobs = jobs.filter(job => job.companyId);
        res.render('student/dashboard', {student, jobs: validJobs, showJobs});
    }
    catch (error) {
        res.status(500).send('Something went wrong.');
    }
}

exports.applyJob = async (req, res) => {
    const { jobId } = req.params;
    const studentId = req.student.id;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        if (student.appliedJobs.includes(jobId)) {
            return res.status(400).json({ success: false, message: "You already applied for this job" });
        }
        student.appliedJobs.push(jobId);
        await student.save();
        return res.json({ success: true });
    } 
    catch (error) {
        console.error("Apply Job Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};