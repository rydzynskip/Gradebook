const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    points: {
        type: Number,
        min: [0, 'Cannot have a negative grade'],
        required: [true, 'Points is required']
    },
    isGraded: {
        type: Boolean,
        default: false,
        required: [true, 'IsGraded is required']
    },
    message: {
        type: String,
        default: 'Currently ungraded'
    },
    assignment: {
        name: String,
        category: String,
        maxPoints: Number,
        description: String
    }
});

AssignmentSchema.post('findOneAndDelete', async function(data) {
    // grade refs in student + assignments
    // when delete student: delete its grades + all the student's grade references in their assignments
    // when delete assignment: delete its grades + all the assignments grade references in its class's students
    // delete assignment
    //    for each grade
    //       delete grade
    //       find class

    // delete assignment reference from its classes
    for (const enrolledClass of data.classes) {
        const foundClass = await Class.findById(enrolledClass).populate();
        foundClass.assignments.splice(foundClass.assignments.indexOf(data._id), 1);
        await foundClass.save();
    }

    // delete all grades associated with this assignment
    for (const grade of data.grades) {
        await Grade.findByIdAndDelete(grade);
    }
});

module.exports = mongoose.model('Grade', GradeSchema);