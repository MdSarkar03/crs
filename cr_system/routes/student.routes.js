const express = require('express');
const router = express.Router();
const studentController = require('../controller/student.controller');
const {isAuth} = require('../middleware/auth');
const Job = require('../models/job.models');

router.get('/signup', (req, res) => {
    res.render('student/signup');
})
router.post('/signup', studentController.signup);

router.get('/signin', (req, res) => {
    res.render('student/signin', {error: null});
})
router.post('/signin', studentController.signin);

router.get('/dashboard', isAuth, studentController.dashboard);

router.post('/apply/:jobId', isAuth, studentController.applyJob);


router.get('/signout', (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/student/signin');
})

module.exports = router;