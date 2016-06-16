Ext.define('QDT.store.tq.WorkflowProcessStatus', {
    extend: 'Ext.data.Store',
    fields: ['status', 'status_string'],
    data: [{
        status: 'open',
        status_string: Profile.getText('stepStatus_Open')
    }, {
        status: 'approved',
        status_string: Profile.getText('stepStatus_Approved')
    }, {
        status: 'pending',
        status_string: Profile.getText('stepStatus_Pending')
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});