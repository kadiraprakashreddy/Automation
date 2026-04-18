'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const rulesRouter = require('./routes/rules');
const automationRouter = require('./routes/automation');
const templatesRouter = require('./routes/templates');
const configRouter = require('./routes/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/config', configRouter);
app.use('/api/rules', rulesRouter);
app.use('/api', automationRouter);
app.use('/api/templates', templatesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
