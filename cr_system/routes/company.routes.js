const express = require("express");
const router = express.Router();
const companyController = require('../controller/company.controller');
const {companyAuth} = require('../middleware/auth');

router.get('/signup', (req, res) => {
    res.render('company/signup');
})
router.post('/signup', companyController.signup);

router.get('/signin', (req, res) => {
    res.render('company/signin', {error: null});
})
router.post('/signin',  companyController.signin);

router.get('/dashboard', companyAuth, companyController.dashboard);

router.get('/postjob',  companyAuth, companyController.jobPage);
router.post('/postjob', companyAuth, companyController.postJob);

router.get('/signout', (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/company/signin');
});

module.exports = router;