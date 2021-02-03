const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const TeacherSchema = new mongoose.Schema({
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
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: String
});

TeacherSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Teacher', TeacherSchema);