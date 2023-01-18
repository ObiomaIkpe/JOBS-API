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
    res.send('update job');
};

const deleteJob = async(req, res) => {
    res.send('delete job');
}


module.exports = {
    getAllJobs, createJob, getJob, updateJob, deleteJob
};