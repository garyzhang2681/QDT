Ext.define('QDT.model.inspection.CustomProject', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'project_id', mapping: 'project_id'
    }, {
        name: 'project', mapping: 'project'
    }, {
        name: 'inspection_type_id', mapping: ''
    }, {
        name: 'pn', mapping: 'pn'
    }, {
        name: 'theory', mapping: 'theory'
    }, {
        name: 'job_count', mapping: 'job_count'
    }, {
        name: 'comment', mapping: 'comment'
    }]
});