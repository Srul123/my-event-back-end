const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const InvitedGuest = require('./invitedGuest');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('invitedGuests', {
    ref: 'InvitedGuest',
    localField: '_id',
    foreignField: 'user'
})

// Hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    InvitedGuest.deleteMany({user: user._id})
    next()
})

userSchema.methods.generateAuthTokenAndSaveUser = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'json_web_token_my_event')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        console.log("Unable to login cause password do not match")
        throw new Error('Unable to login')
    }

    return user;
}


const User = mongoose.model('User', userSchema)

module.exports = User