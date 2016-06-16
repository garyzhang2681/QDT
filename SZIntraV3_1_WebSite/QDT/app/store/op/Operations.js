Ext.define('QDT.store.op.Operations', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.op.Operation',
    pageSize: 50,
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpPmb.GetOperations',
        paramsAsHash: true,
        reader: {
            root: 'data'
        }
    }
});