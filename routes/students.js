const express = require('express'),
      router = express.Router(),
      Class = require('../models/class'),
      Student = require('../models/student'),
      middleware = require('../middleware/index');


// INDEX - shows teachers list of students
router.get('/', middleware.isLoggedIn, async (req, res) => {
    const students = await Student.find({ teacher: req.user.username });
    res.render('students/index', { students: students });
});


// SHOW - shows info on a certain student
router.get('/:id', middleware.isLoggedIn, async (req, res) => {
    const foundStudent = await Student.findById(req.params.id);
    res.render('students/show', { student: foundStudent });
});


// EDIT - shows edit form for a certain student
router.get('/:id/edit', middleware.isLoggedIn, async (req, res) => {
    const foundStudent = await Student.findById(req.params.id);
    res.render('students/edit', { students: foundStudent });
});


// UPDATE - updates a particular student
router.put('/:id', middleware.isLoggedIn, async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true});
    res.redirect('/students/' + updatedStudent._id);
});


// DESTROY - deletes a particular student
router.delete('/:id', middleware.isLoggedIn, async (req, res) => {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.redirect('/students');
});


module.exports = router;