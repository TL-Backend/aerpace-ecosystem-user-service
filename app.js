'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
app.disable('x-powered-by');
const cors = require('cors');

const { errorResponse } = require('./src/utils/responseHandler');
const { statusCodes } = require('./src/utils/statusCode');
const { router } = require('./src/routes/index');
const {
  addMasterPermissionsToCache,
} = require('./src/controllers/role/role.helper');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: `${process.env.HOST_URL}`,
  }),
);

app.use('/api/v1', router);

app.use((req, res, next) =>
  errorResponse({
    code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
    req,
    res,
    message: 'Route not found',
  }),
);

app.use((error, req, res, next) =>
  errorResponse({
    code: statusCodes.STATUS_CODE_FAILURE,
    req,
    res,
    error,
    message: error.message,
  }),
);

app.listen(process.env.PORT || 3000, () => {
  addMasterPermissionsToCache();
  console.log(`server started running on port ${process.env.PORT || 3000}`);
});
