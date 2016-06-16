Ext.define('QDT.model.tq.WorkflowAction', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'action_target',
        'target_id',
        'process_action',
        'handler',
        'process_time',
        'remark'
    ]
});