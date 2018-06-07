/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost');

var extend = almost.createExtender({
    custom: {
        isRed: function (element) {
            return element.get('type') === 'source.Red';
        }
    }
});

var transform = almost.createTransformer({
    element: [almost.createRule(
        function (element, model) {
            return model.isRed(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: 'source.Red',
                    metadata: {
                        graphics: {
                            position: {
                                x: element.prop('position/x'),
                                y: element.prop('position/y')
                            },
                            size: {
                                width: element.prop('size/width'),
                                height: element.prop('size/height')
                            }
                        }
                    }
                }
            };
        }
    )]
});

function toJSON(cells) {
    return transform(extend({
        elements: cells,
        relations: []
    }), 'm2a');
}

exports.toJSON = toJSON;
