const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, 'please input job name'],
        maxlength: 50
    },
    position:{
        type: String,
        required: [true, 'please input job name'],
        maxlength: 100
    },
    status:{
        type: String,
        required: [true, 'please input job name'],
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: [true, 'please provide a user']
    },
    
},{timestamps:true})

module.exports = mongoose.model('Job', jobSchema);