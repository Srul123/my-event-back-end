const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
        trim: true,
        min: 6
    },
})

// Hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    const salt = await bcrypt.genSalt(10);
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, salt)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'json_web_token_my_event')
    return token
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