const jobModel = require('../models/jobs');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors');


const getAllJobs  = async(req, res) => {
    const job = await jobModel.find({createdBy:req.user.userId})
res.status(StatusCodes.OK).json({job, count: job.length});
};

const getJob = async(req, res) => {
    const {user:{userId},params:{id:jobId}} = req
    const job = await jobModel.findOne({_id:jobId, createdBy:userId
    })
    if(!job){ 
        throw new NotFoundError(`no job with Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job});
};

const createJob = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body)
    res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async(req, res) => {
    const {body:{company, position}, user:{userId},params:{id:jobId}} = req
    if (company === '' || position === ''){
        throw new BadRequestError('company or position cannot be empty')
    }

    const job = await jobModel.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators:true})

    if(!job){
        throw new NotFoundError('no job with specified id')
    }

    res.status(StatusCodes.OK).json({job})
};

const deleteJob = async(req, res) => {
    const {user:{userId},params:{id:jobId}} = req

    const job = await jobModel.findByIdAndDelete({_id:jobId, createdBy:userId})

    if(!job){
        throw new NotFoundError('no job with specified id')
    }

    res.status(StatusCodes.OK).send()
}


module.exports = {
    getAllJobs, createJob, getJob, updateJob, deleteJob
};