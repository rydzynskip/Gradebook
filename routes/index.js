const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      Teacher = require('../models/teacher'),
      middleware = require('../middleware/index');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('landing', { title: 'GradeBook' });
});

/* GET login page. */
router.get('/login', (req, res) => {
    res.render('authorization/login');
});

/* POST for login. */
router.post('/login', passport.authenticate('local', {
        successFlash: 'Welcome back!',
        successRedirect: '/classes',
        failureFlash: true,
        failureRedirect: '/login'
    }), (req, res) => {
});

/* GET register page. */
router.get('/register', (req, res) => {
    res.render('authorization/register');
});

/* POST for register. */
router.post('/register', async (req, res) => {
    const newTeacher = await new Teacher({ username: req.body.username });
    Teacher.register(newTeacher, req.body.password, (err, teacher) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }

        passport.authenticate("local", (req, res) => {
            req.flash('success', 'Successfully Signed Up! Nice to meet you ' + req.body.username);
            res.redirect("/classes");
        });
    });
});

/* GET logout page. */
router.get('/logout', middleware.isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
});

module.exports = router;
