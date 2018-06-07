/*jslint node: true */
"use strict";

var express = require('express');

function createRouter() {
    var router = express.Router();

    return router;
}

exports.createRouter = createRouter;
