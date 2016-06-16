Ext.define('QDT.model.IrdRouteItem', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'serial', mapping: 'serial'
    }, {
        name: 'job', mapping: 'job'
    }, {
        name: 'suffix', mapping: 'suffix'
    }, {
        name: 'item', mapping: 'item'
    }, {
        name: 'create_by', mapping: 'create_by'
    }, {
        name: 'ird_revision', mapping: 'ird_revision'
    }, {
        name: 'rev_level', mapping: 'rev_level'
    }, {
        name: 'operator_op', mapping: 'operator_op'
    }]
});