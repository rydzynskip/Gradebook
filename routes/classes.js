const express = require('express'),
      router = express.Router(),
      Class = require('../models/class'),
      Student = require('../models/student'),
      Assignment = require('../models/assignment'),
      Grade = require('../models/assignment'),
      middleware = require('../middleware/index');


// INDEX - shows teachers list of classes
router.get('/', middleware.isLoggedIn, async (req, res) => {
    const classes = await Class.find({ teacher: req.user.username });
    res.render('classes/index', { classes: classes });
});


// NEW - shows new class form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('classes/new');
});


// CREATE - creates new class
router.post('/', middleware.isLoggedIn, async (req, res) => {
    const newClass = new Class(req.body);
    newClass.teacher = req.user.username;
    await newClass.save();
    res.redirect('/classes');
});


// SHOW - shows info on a certain class
router.get('/:id', middleware.isLoggedIn, async (req, res) => {
    const foundClass = await Class.findById(req.params.id);
    res.render('classes/show', { _class: foundClass });
});


// EDIT - shows edit form for a certain class
router.get('/:id/edit', middleware.isLoggedIn, async (req, res) => {
    const foundClass = await Class.findById(req.params.id);
    res.render('classes/edit', { _class: foundClass });
});


// UPDATE - updates a particular class
router.put('/:id', middleware.isLoggedIn, async (req, res) => {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true});
    res.redirect('/classes/' + updatedClass._id);
});


// DESTROY - deletes a particular class
router.delete('/:id', middleware.isLoggedIn, async (req, res) => {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    res.redirect('/classes');
});


module.exports = router;