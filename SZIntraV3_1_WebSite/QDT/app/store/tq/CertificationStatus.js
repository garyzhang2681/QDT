Ext.define('QDT.store.tq.CertificationStatus', {
    extend: 'Ext.data.Store',
    fields: ['status', 'status_string'],
    data: [{
        status: 'active',
        status_string: Profile.getText('active')
    }, {
        status: 'inactive',
        status_string: Profile.getText('inactive')
    }, {
        status: 'pending',
        status_string: Profile.getText('PendingApproval')
    }, {
        status: 'canceled',
        status_string: Profile.getText('canceled')
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});