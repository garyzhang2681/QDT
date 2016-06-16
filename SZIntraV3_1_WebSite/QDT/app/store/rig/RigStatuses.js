Ext.define('QDT.store.rig.RigStatuses', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.RigStatus',

    data: [{
        status: 'Active'
    }, {
        status: 'Closed'
    }]
});