var express = require('express');
var router = express.Router();
var db = require('../../models/db');
var helper = require('../../routes/tablehelper');
var fs = require('fs');
var drawCounter = 1;
const processingHelper = require("../../api/tables/processinghelper");

// POST
router.post('/', function(req, res) {
  processingHelper.processTable(req, res, req.body.table);
});

module.exports = router;
