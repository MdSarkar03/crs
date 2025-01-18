const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

const connectToDB = require('./config/db');
connectToDB();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

const {admin} = require('./controller/admin.controller');
mongoose.connection.once('open', async () => {
    await admin();
    console.log('Database connection established');
});

const adminRouter = require('./routes/admin.routes');
const studentRouter = require('./routes/student.routes');
const companyRouter = require('./routes/company.routes');

app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/company', companyRouter);

app.get('/', (req, res) => {
    res.render('home');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));