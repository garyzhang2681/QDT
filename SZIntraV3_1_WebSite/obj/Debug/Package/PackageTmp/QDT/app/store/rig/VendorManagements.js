Ext.define('QDT.store.rig.VendorManagements', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.VendorManagement',
    proxy: {
        type: 'direct',
        directFn: DpRig.GetVendorAll,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
