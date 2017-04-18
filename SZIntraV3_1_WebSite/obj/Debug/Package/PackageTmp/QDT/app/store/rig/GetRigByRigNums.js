Ext.define('QDT.store.rig.GetRigByRigNums', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.GetRigByRigNum',
    proxy: {
        type: 'direct',
        directFn: DpRig.GetRigByRigNum,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});
