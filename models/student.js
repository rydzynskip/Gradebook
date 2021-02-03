const mongoose = require('mongoose'),
      Grade = require('../models/grade'),
      Class = require('../models/class'),
      Assignment = require('../models/assignment');

const StudentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    moreInfo: {
        type: String,
        default: 'No extra information'
    },
    teacher: String,
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    grades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Grade'
        }
    ]
});

StudentSchema.post('findOneAndDelete', async function(data) {
    // delete student reference from its classes
    for (const enrolledClass of data.classes) {
        const foundClass = await Class.findById(enrolledClass).populate();
        foundClass.students.splice(foundClass.students.indexOf(data._id), 1);
        await foundClass.save();
    }

    // delete all grades associated with this student
    for (const grade of data.grades) {
        const deletedGrade = await Grade.findByIdAndDelete(grade);

        // delete reference from the grade's assignment
        const foundAssignment = Assignment.findOne({ name: deletedGrade.assignment.name }).populate();
        foundAssignment.grades.splice(foundAssignment.grades.indexOf(deletedGrade._id), 1);
        await foundAssignment.save();
    }
});

module.exports = mongoose.model('Student', StudentSchema);