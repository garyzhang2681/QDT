Ext.define('QDT.store.tq.WorkflowActionTypes', {
    extend: 'Ext.data.Store',
    fields: [
        'process_action',
        { name: 'action_name', convert: function (v, record) {
            return Profile.getText('workflowActionType_' + record.data.process_action);
        }
        }
    ],
    data: [{
        process_action: 'acknowledge'
    }, {
        process_action: 'approve'
    }, {
        process_action: 'reject'
    }, {
        process_action: 'cancel'
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});