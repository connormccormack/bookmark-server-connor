require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bookmarkRouter = require('./bookmark/bookmark-router');
const logger = require('./logger');

const app = express();

const morganOption = NODE_ENV === 'production'
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

// authentication middleware
app.use(function validateBearerToken(req, res, next) {
  console.log('test 1');
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});


app.use('/', bookmarkRouter);



app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  let response;
  if (NODE_ENV === 'production') {
    response = {
      error: {
        message: 'error'
      }
    };
  } else {
    response = {
      message: error.message
    };
  }
  res.status(500).json(response);
});

// if no route matches, return 404 with HTML page - Express default route

module.exports = app;