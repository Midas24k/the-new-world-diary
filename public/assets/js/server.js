const express = require('express');
const path = require('path');
// const bodyParsing = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// for Middleware to parse JSON data use express.json() / express.urlencoded()