const jwt = require('jsonwebtoken');
const Student = require('../models/student.models');

exports.isAuth = async (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/student/signin'); 
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        req.student = student;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

exports.companyAuth = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/company/signin'); 
    }
    try {
        req.company = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

exports.isAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/admin/signin');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
