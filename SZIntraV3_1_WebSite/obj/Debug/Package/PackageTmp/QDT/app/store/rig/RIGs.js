Ext.define('QDT.store.rig.RIGs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.RIG',
    proxy: {
        type: 'direct',
        directFn: DpRig.GetRig,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
