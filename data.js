const mongoose = require('mongoose');
const Class = require('./models/class');
const Student = require('./models/student');
const Assignment = require('./models/assignment');
const Grade = require('./models/grade');


const classData = [
    {
        subject: 'Mathematics',
        name: 'Algebra',
        section: 6,
        level: '8',
        capacity: 20,
        teacher: 'peter',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut interdum mi non lacus pretium, et venenatis velit consequat. Morbi ac turpis volutpat, ultrices justo ut, congue enim. Ut non lacus eu lacus tempus accumsan. Fusce sodales posuere est vel pretium. Fusce maximus eros quis leo vehicula rhoncus. Duis in mauris arcu. Nullam suscipit vel dui tincidunt eleifend. Curabitur sit amet neque ut orci scelerisque eleifend. Donec vitae suscipit nunc. Pellentesque lorem urna, vestibulum ac dui in, tristique rhoncus elit. In non scelerisque mauris. Etiam condimentum urna scelerisque arcu vulputate, ut tempus justo vestibulum. Cras in porttitor neque. Suspendisse in sodales sem. Phasellus massa ipsum, semper non tempor ut, gravida ac nisl.'
    },
    {
        subject: 'Mathematics',
        name: 'Calculus',
        section: 2,
        level: 'college',
        capacity: 15,
        teacher: 'peter',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut interdum mi non lacus pretium, et venenatis velit consequat. Morbi ac turpis volutpat, ultrices justo ut, congue enim. Ut non lacus eu lacus tempus accumsan. Fusce sodales posuere est vel pretium. Fusce maximus eros quis leo vehicula rhoncus. Duis in mauris arcu. Nullam suscipit vel dui tincidunt eleifend. Curabitur sit amet neque ut orci scelerisque eleifend. Donec vitae suscipit nunc. Pellentesque lorem urna, vestibulum ac dui in, tristique rhoncus elit. In non scelerisque mauris. Etiam condimentum urna scelerisque arcu vulputate, ut tempus justo vestibulum. Cras in porttitor neque. Suspendisse in sodales sem. Phasellus massa ipsum, semper non tempor ut, gravida ac nisl.'
    },
    {
        subject: 'Science',
        name: 'Physics',
        level: '11',
        capacity: 17,
        teacher: 'Stoshua',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut interdum mi non lacus pretium, et venenatis velit consequat. Morbi ac turpis volutpat, ultrices justo ut, congue enim. Ut non lacus eu lacus tempus accumsan. Fusce sodales posuere est vel pretium. Fusce maximus eros quis leo vehicula rhoncus. Duis in mauris arcu. Nullam suscipit vel dui tincidunt eleifend. Curabitur sit amet neque ut orci scelerisque eleifend. Donec vitae suscipit nunc. Pellentesque lorem urna, vestibulum ac dui in, tristique rhoncus elit. In non scelerisque mauris. Etiam condimentum urna scelerisque arcu vulputate, ut tempus justo vestibulum. Cras in porttitor neque. Suspendisse in sodales sem. Phasellus massa ipsum, semper non tempor ut, gravida ac nisl.'
    },
    {
        subject: 'History',
        name: 'World History',
        level: '8',
        capacity: 27,
        teacher: 'Stoshua',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut interdum mi non lacus pretium, et venenatis velit consequat. Morbi ac turpis volutpat, ultrices justo ut, congue enim. Ut non lacus eu lacus tempus accumsan. Fusce sodales posuere est vel pretium. Fusce maximus eros quis leo vehicula rhoncus. Duis in mauris arcu. Nullam suscipit vel dui tincidunt eleifend. Curabitur sit amet neque ut orci scelerisque eleifend. Donec vitae suscipit nunc. Pellentesque lorem urna, vestibulum ac dui in, tristique rhoncus elit. In non scelerisque mauris. Etiam condimentum urna scelerisque arcu vulputate, ut tempus justo vestibulum. Cras in porttitor neque. Suspendisse in sodales sem. Phasellus massa ipsum, semper non tempor ut, gravida ac nisl.'
    }
];

const studentData = [
    {
        name: 'Peter Rydzynski',
        email: 'peter.rydzynski@gmail.com'
    },
    {
        name: 'Josh Allen',
        email: 'josh.allen@gmail.com'
    },
    {
        name: 'Mike Tolbert',
        email: 'mike.tolbert@gmail.com'
    }
];

const assignmentData = [
    {
        name: 'Homework 1',
        type: 'homework',
        maxPoints: '50'
    },
    {
        name: 'Quiz 1',
        type: 'quiz',
        maxPoints: '100'
    },
    {
        name: 'Homework 2',
        type: 'homework',
        maxPoints: '30'
    }
];

async function seedDB() {
    // Remove all classes
    await Class.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Removed classes!');
    });

    // Remove all students
    await Student.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Removed students!');
    });

    // Remove all assignments
    await Assignment.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Removed assignments!');
    });

    // Remove all grades
    await Grade.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Removed grades!');
    });

    // Add a few classes
    for (const seed1 of classData) {
        const _class = new Class(seed1);
        console.log('Added a class');

        // // Add students
        // for (const seed2 of studentData) {
        //     const student = new Student(seed2);
        //     await student.save();
        //     console.log('  Created a student');
        //     _class.students.push(student);
        // }
        //
        // // Add assignments
        // for (const seed2 of assignmentData) {
        //     const assignment = new Assignment(seed2);
        //     await assignment.save();
        //     console.log('  Created an assignment');
        //     _class.assignments.push(assignment);
        // }

        await _class.save();
    }
}

module.exports = seedDB;