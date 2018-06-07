/*jslint node: true, nomen: true */
"use strict";

exports.target = {
    elements: require('./elements').elements,
    links: {},
    nets: {},
    fromJSON: require('./fromjson').fromJSON
};
