const express = require('express'),
      router = express.Router({mergeParams: true}),
      Class = require('../models/class'),
      Grade = require('../models/grade'),
      Assignment = require('../models/assignment'),
      Student = require('../models/student'),
      middleware = require('../middleware/index');


// INDEX - shows list of assignments
router.get('/', middleware.isLoggedIn, async (req, res) => {
    const foundClass = await Class.findById(req.params.id).populate('assignments');
    res.render('assignments/index', { _class: foundClass} );
});


// NEW - shows new assignment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('assignments/new', { classId: req.params.id });
});


// CREATE - creates new assignment
router.post('/', middleware.isLoggedIn, async (req, res) => {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();

    const foundClass = await Class.findById(req.body.id);
    foundClass.assignments.push(newAssignment);

    for (const studentId of foundClass.students) {
        const newGrade = new Grade({
            points: 0,
            message: 'Not currently graded',
            assignment: newAssignment
        });
        await newGrade.save();

        const foundStudent = await Student.findById(studentId);
        foundStudent.grades.push(newGrade);
        await foundStudent.save();
    }

    await foundClass.save();
    res.redirect('/classes/' + foundClass._id + '/assignments');
});


// SHOW - shows info on a certain assignment
router.get('/:assignmentId', middleware.isLoggedIn, async (req, res) => {
    const foundAssignment = await Assignment.findById(req.params.assignmentId);
    res.render('assignments/show', { classId: req.params.id, assignment: foundAssignment });
});


// EDIT - shows edit form for a certain assignment
router.get('/:assignmentId/edit', middleware.isLoggedIn, async (req, res) => {
    const foundAssignment = await Assignment.findById(req.params.assignmentId);
    res.render('assignments/edit', { classId: req.params.id, assignment: foundAssignment });
});


// UPDATE - updates a particular assignment
router.put('/:assignmentId', middleware.isLoggedIn, async (req, res) => {
    const updatedAssignment = await Student.findByIdAndUpdate(req.params.assignmentId, req.body, {runValidators: true, new: true});

    // update the grades as assignment is only embedded

    res.redirect('/classes/' + req.params.id + '/assignments/' + req.params.assignmentId);
});


// DESTROY - deletes a particular assignment
router.delete('/:assignmentId', middleware.isLoggedIn, async (req, res) => {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.assignmentId);

    // delete assignment reference from its class
    const foundClass = await Class.findById(req.params._id).populate();
    foundClass.assignments.splice(foundClass.assignments.indexOf(deletedAssignment._id), 1);
    await foundClass.save();

    // delete all grades of this assignment
    for (const grade of deletedAssignment.grades) {
        await Grade.findByIdAndDelete(grade);
    }

    // delete all these grade references in students


    res.redirect('/classes/' + req.params.id + '/assignments/');
});


module.exports = router;