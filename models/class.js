const mongoose = require('mongoose'),
      Assignment = require('../models/assignment'),
      Student = require('../models/student');

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    section: {
        type: Number,
        min: [1, 'Section number must be positive']
    },
    subject: {
        type: String,
        enum: ['Mathematics', 'Science', 'History', 'Engineering', 'English'],
        required: [true, 'Subject is required']
    },
    level: {
        type: String,
        enum: ['pre-6', '6', '7', '8', '9', '10', '11', '12', 'college'],
        required: [true, 'Level is required']
    },
    capacity: {
        type: Number,
        min: [1, 'Have to have at least 1 student'],
        default: 1,
        required: [true, 'Capacity is required']
    },
    description: {
        type: String,
        default: 'No description'
    },
    teacher: String,
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    assignments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment'
        }
    ]
});

ClassSchema.post('findOneAndDelete', async function(data) {
    // delete class reference from its students
    for (const student of data.students) {
        const foundStudent = await Student.findById(student).populate();
        foundStudent.classes.splice(foundStudent.classes.indexOf(data._id), 1);
        await foundStudent.save();
    }

    // delete all assignments associated with this class
    for (const assignment of data.assignments) {
        await Assignment.findByIdAndDelete(assignment);
    }
});

module.exports = mongoose.model("Class", ClassSchema);