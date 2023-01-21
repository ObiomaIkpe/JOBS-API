const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide an email'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type: String,
        required: [true, 'please provide an email'],
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.passwordValidation = async function (incomingPassword){
    const isMatch = await bcrypt.compare(incomingPassword, this.password)
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);