const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {badRequestError, UnauthenticatedError} = require('../errors');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const user = await User.create({...req.body});
       const token = user.createJWT();
    
        res.status(StatusCodes.CREATED).json({user: {name:user.name, }, token })
    }
    //pass:user.password
     catch (error) {
     console.log(error)   
    }

}
   

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new badRequestError('please provide email and password');
    }

    const user = await User.findOne({email})
    //compare passwords
    if(!user){
        throw new UnauthenticatedError('invalid credentials')
    }
    const passwordValidate = await user.passwordValidation(password)
    if(!passwordValidate){
        throw new UnauthenticatedError('invalid password')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name:user.name}, token});
};

module.exports = {
    registerUser,
    loginUser
}
