const mongoose = require('mongoose');
const validator = require('validator');


const InvitedGuest = mongoose.model('InvitedGuest', {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 2) {
                throw new Error('Invalid name');
            }
        }
    },
    totalInvited: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 1) {
                throw new Error('Invalid number of accompanies invited guests');
            }
        },
        default: 1,

    },
    phoneNumber: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (value !== "" && !validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
        default: "",
    },
    arrivalStatus: {
        type: Number,
        default: 4
    },
    comments: {
        type: String,
        default: "",
    }
})

module.exports = InvitedGuest;

