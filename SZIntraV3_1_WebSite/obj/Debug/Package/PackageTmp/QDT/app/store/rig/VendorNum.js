Ext.define('QDT.store.rig.VendorNum', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.VendorManagement',
    proxy: {
        type: 'direct',
        directFn: DpRig.GetVendorNum,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
