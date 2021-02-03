const express = require('express'),
      router = express.Router({mergeParams: true}),
      Class = require('../models/class'),
      Student = require('../models/student'),
      middleware = require('../middleware/index');


// INDEX - shows list of students
router.get('/', middleware.isLoggedIn, async (req, res) => {
    const foundClass = await Class.findById(req.params.id).populate('students');
    res.render('classesStudents/index', { _class: foundClass });
});


// NEW - shows new student form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('classesStudents/new', { classId: req.params.id });
});


// CREATE - creates new student
router.post('/', middleware.isLoggedIn, async (req, res) => {
    const foundClass = await Class.findById(req.params.id)

    const newStudent = new Student(req.body);
    newStudent.teacher = req.user.username;
    newStudent.classes.push(foundClass);
    await newStudent.save();

    foundClass.students.push(newStudent);
    await foundClass.save();
    res.redirect('/classes/' + foundClass._id + '/students');
});


// SHOW - shows info on a certain student
router.get('/:studentId', middleware.isLoggedIn, async (req, res) => {
    const foundStudent = await Student.findById(req.params.studentId);
    res.render('classesStudents/show', { classId: req.params.id, student: foundStudent });
});


// EDIT - shows edit form for a certain student
router.get('/:studentId/edit', middleware.isLoggedIn, async (req, res) => {
    const foundStudent = await Student.findById(req.params.studentId);
    res.render('classesStudents/edit', { classId: req.params.id, student: foundStudent });
});


// UPDATE - updates a particular student
router.put('/:studentId', middleware.isLoggedIn, async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.studentId, req.body, {runValidators: true, new: true});
    res.redirect('/classes/' + req.params.id + '/students/' + updatedStudent._id);
});


// DESTROY - deletes a particular student
router.delete('/:studentId', middleware.isLoggedIn, async (req, res) => {
    const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);
    res.redirect('/classes/' + req.params.id + '/students');
});


module.exports = router;