Ext.define('Asz.store.op.WorkCenters', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.op.WorkCenter',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpPmb.GetWorkCenters',
        reader: {
            root: 'data'
        }
    }
});