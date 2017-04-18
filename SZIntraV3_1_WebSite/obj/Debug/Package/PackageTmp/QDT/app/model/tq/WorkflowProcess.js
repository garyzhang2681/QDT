Ext.define('QDT.model.tq.WorkflowProcess', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'request_id',
        'step',
        'name',
        'status',
        'start_time',
        'end_time',
        'approvers'
    ]
});