const mongoose = require('mongoose'),
      Grade = require('../models/grade'),
      Class = require('../models/class'),
      Student = require('../models/student');

const AssignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    category: {
        type: String,
        enum: ['test', 'quiz', 'homework', 'classwork', 'lab', 'project'],
        required: [true, 'Category is required']
    },
    maxPoints: {
        type: Number,
        min: [0, 'Cannot have a negative grade'],
        required: [true, 'Maximum points is required']
    },
    description: {
        type: String,
        default: 'No assignment description'
    },
    grades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Grade'
        }
    ]
});

AssignmentSchema.post('findOneAndDelete', async function(data) {
    // delete assignment reference from its classes
    for (const enrolledClass of data.classes) {
        const foundClass = await Class.findById(enrolledClass).populate();
        foundClass.assignments.splice(foundClass.assignments.indexOf(data._id), 1);
        await foundClass.save();
    }

    // delete all grades associated with this assignment
    for (const grade of data.grades) {
        const deletedGrade = await Grade.findByIdAndDelete(grade);
    }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);