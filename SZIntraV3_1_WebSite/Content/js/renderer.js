/// <reference path="../../extjs/ext-all.js" />
function dateRenderer(value) {
    
    return Ext.Date.format(value, 'Y-m-d H:i');
};

function dueDateRenderer(value) {

    var currentDate = Ext.Date.format(new Date(), 'Y-m-d');
    var dueDate = Ext.Date.format(value, 'Y-m-d');

    if (Date.parse(dueDate) < Date.parse(currentDate)) {
        return '<span style="color:red;">' + dueDate + '</span>';
    }
    else {
        return '<span style="color:green;">' + dueDate + '</span>';
    }
};