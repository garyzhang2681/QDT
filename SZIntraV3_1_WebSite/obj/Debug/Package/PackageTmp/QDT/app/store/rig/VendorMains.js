Ext.define('QDT.store.rig.VendorMains', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.VendorManagement',
    proxy: {
        type: 'direct',
        directFn: DpRig.GetVendorName,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
