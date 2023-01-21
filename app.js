

const express = require('express');
const app = express();
require('dotenv').config().parsed;
// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss =  require('xss-clean');
const rateLimit = require('express-rate-limit');


const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocs = YAML.load('./swagger.yaml');


const connectDB = require('./db/connect');
require('express-async-errors');
const error = require('./errors');
const authRouter = require('./routes/authRoutes');
const jobRouter = require('./routes/jobRoutes');
const authenticateUser = require('./middleware/authentication');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(xss());

app.set('trust proxy', 1);
app.use(rateLimit({
    windowMs: 15 * 60 * 60, // 15 minutes
    max: 100, //limit each ip address to 100 requests per windowMs
}));

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('<h1> JOBS API</h1><a href="/api-docs">documentation</a>')
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/job', authenticateUser, jobRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        //console.log(process.env)
        app.listen (port, console.log(`app is listening on port ${port}`));
    }
    catch(err){
        console.log(err);
    }
}


start();