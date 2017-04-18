Ext.define('QDT.store.rig.Liabilitys', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.Liability',
    proxy: {
        type: 'direct',
        directFn: DpRig.QueryLiabilitys,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});
