const express = require('express');
//const {registerUser} = require('../controllers/authController')
const router = express.Router(); 

const {getAllJobs, createJob, getJob, updateJob, deleteJob} =  require('../controllers/jobControllers');

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);


module.exports = router;
 