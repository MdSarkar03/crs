const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Company = require('../models/company.models');
const Job = require('../models/job.models');

exports.signup = async (req, res) => {
    try{
        const {name, email, phone, location, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const newCompany = new Company({
            name, email, phone, location, password: hashPassword
        })
        await newCompany.save();

        res.render('partials/signup-success' , {
            message: 'Sign up Successful! Now you can sign in.',
            redirectUrl: '/company/signin'
        });
    }
    catch(error) {
        res.status(500).send('Error signing up: ' + error.message);
    }
}

exports.signin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const company = await Company.findOne({email});
         
        if(!company) {
            console.log('company not found');
            return res.render('company/signin', {error: 'Invalid email or password!'});
        }       
        const isPassword = await bcrypt.compare(password, company.password);        
        if(!isPassword) {      
            return res.render('company/signin', {error: 'Invalid email or password!'});
        }

        const token = jwt.sign(
            {id: company._id, name: company.name, email: company.email, location: company.location}, 
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );      
        res.cookie('auth_token', token, {httpOnly: true, maxAge: 3600000});
        res.redirect('/company/dashboard')
    }
    catch(error) {
        res.render('company/signin', {error: 'Something went wrong, Please try again!'});
    }
}

exports.dashboard = async (req, res) => {
    try{
        const company = req.company;
        if(!company){
            return res.redirect('/company/signin');
        }
        const jobs = await Job.find({companyId: company.id}).lean();
        res.render('company/dashboard', {company, jobs});
    }
    catch(error) {
        res.status(500).send('Something went wrong!');
    }
}

exports.jobPage = async (req, res) => {
    try{
        if(!req.company){
            return res.redirect('/company/signin');
        }
        res.render('company/postjob', {company: req.company, successMessage: null});
    }
    catch(error) {
        res.status(500).send('Something went wrong!');
    }
}
exports.postJob = async (req, res) => {
    try{
        const company = req.company;
        if(!company){
            return res.redirect('/company/signin');
        }

        const {title, description, vacancy, salary, lastDate} = req.body;
        const dateObj = new Date(lastDate.split('/').reverse().join('-'));
        const newJob = new Job({
            companyId: company.id, title, description, vacancy, salary, lastDate: dateObj, postedBy: req.company.id
        })
        await newJob.save();

        return res.render('company/postjob', {
            company: req.company,
            successMessage: 'Job posted successfully!'
        })
    }
    catch(error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
}