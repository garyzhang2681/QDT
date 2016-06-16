Ext.define('QDT.store.rig.VendorStatuss', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.VendorStatus',

    data: [{
        status: 'Active'
    }, {
        status: 'Inactive'
    }]
});