/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    joint = require('joint'),
    Blob = require('Blob'),
    saveAs = require('FileSaver'),
    FileReader = require('FileReader'),
    createBoard = require('almost-joint').createBoard,
    source = require('./source').source,
    defaultLink = require('./defaultlink').defaultLink,
    AException = require('almost').Exception;

function toBuilder(Element) { return function () { return [new Element()]; }; }

var sourceModel = new joint.dia.Graph(),
    sourceBuilders = _.values(source.elements).map(toBuilder).concat(_.values(source.nets)),
    sourceBoard = createBoard({
        el: '#source-model > .board',
        model: sourceModel,
        defaultLink: defaultLink
    }),
    sourceMenu = sourceBoard.createElementsMenu({
        container: '#source-model > .sidebar > ul',
        template: '<a class="list-group-item almost-place-holder"></a>',
        builders: sourceBuilders,
        width: 170
    });

sourceBoard.zoomE();

$('#source-model > .sidebar .png-download').click(function () {
    sourceBoard.download();
    return false;
});

$('#source-model > .sidebar .model-download').click(function () {
    var model = source.toJSON(sourceModel.getCells());
    saveAs(new Blob([JSON.stringify(model)], {type: 'application/json'}), 'source-model.json');
    return false;
});

$('#source-model > input[type=file]').change(function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        sourceModel.clear();
        sourceBoard.clearHistory();
        try {
            var start = new Date(),
                input = JSON.parse(e.target.result);
            sourceModel.addCells([]); // TODO
            sourceBoard.clearHistory();
            $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
        } catch (exception) {
            sourceBoard.clearHistory();
            $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
        sourceBoard.zoomE();
    };

    reader.onerror = function () {
        $.notify({message: 'Error loading file!'}, {allow_dismiss: true, type: 'danger'});
    };

    reader.readAsText(this.files[0]);

    this.value = '';
});

$('#source-model > .sidebar .model-load').click(function () {
    $('#source-model > input[type=file]').click();
    return false;
});
