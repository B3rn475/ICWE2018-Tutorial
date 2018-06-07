/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost');

var extend = almost.createExtender({
    type: {
        Red: 'source.Red'
    }
});

var transform = almost.createTransformer({
    model: [almost.createRule(
        almost.Rule.always,
        function () {
            return {
                elements: {
                    id: 'Fixed',
                    type: 'target.Blue',
                    metadata: {
                        graphics: {
                            position: {x: 0, y: 0},
                            size: {width: 50, height: 50}
                        }
                    }
                }
            };
        }
    )],
    element: [almost.createRule(
        function (element, model) {
            return model.isRed(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: 'target.Blue',
                    metadata: {
                        graphics: {
                            position: element.metadata.graphics.position,
                            size: element.metadata.graphics.size,
                        }
                    }
                }
            };
        }
    )]
}, 'm2a');

function myAmazingTransformation(model) {
    return transform(extend(model));
}

exports.myAmazingTransformation = myAmazingTransformation;
