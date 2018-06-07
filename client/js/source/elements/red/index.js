/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    joint = require('joint');

exports.Red = joint.shapes.basic.Generic.extend({
    markup: require('./markup.svg'),

    defaults: joint.util.deepSupplement({
        type: 'source.Red',
        size: {width: 50, height: 50},
        attrs: {}
    }, joint.shapes.basic.Generic.prototype.defaults),

    minsize: {width: 50, height: 50},
    resizable: true,

    initialize: function () {
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },
});
