const userAuth = require('../models/user');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');
const user = require('../models/user');

const auth = (req, res, next) => {
    //check header
    const autHeader = req.headers.authorization;
    if (!autHeader || !autHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('authentication invalid');
    };
    const token =  autHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to the job routes
        req.user = {userId:payload.userId, name:payload.name, }
        next()
    } catch (error) {
        throw new UnauthenticatedError('invalid auth')
    }
}

module.exports = auth;