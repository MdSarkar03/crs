const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const {isAdmin} = require('../middleware/auth'); 

router.get('/signin', (req, res) => {
    res.render('admin/signin', {error: null});
});
router.post('/signin', adminController.signin);

router.get('/dashboard', isAdmin, adminController.dashboard);

router.get('/getCompanies', isAdmin, adminController.getCompanies);
router.get('/getStudents', isAdmin, adminController.getStudents);
router.get('/getJobs', isAdmin, adminController.getJobs);

router.delete('/company/:id', isAdmin, adminController.deleteCompany);
router.delete('/student/:id', isAdmin, adminController.deleteStudent);

router.get('/signout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/signin');
})

module.exports = router;