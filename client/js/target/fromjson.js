/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost'),
    target = require('./elements');

var extend = almost.createExtender({
    type: {
        Blue: 'target.Blue'
    }
});

var transform = almost.createTransformer({
    element: [almost.createRule(
        function (element, model) {
            return model.isBlue(element);
        },
        function (element) {
            return new target.elements.Blue({
                id: element.id,
                position: element.metadata.graphics.position,
                size: element.metadata.graphics.size
            });
        }
    )]
}, almost.core.flatten());

function fromJSON(model) {
    return transform(extend(model));
}

exports.fromJSON = fromJSON;
