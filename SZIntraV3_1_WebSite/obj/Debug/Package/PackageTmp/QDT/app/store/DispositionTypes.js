Ext.define('QDT.store.DispositionTypes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',

    proxy: {
        type: 'direct',
        directFn: QDT.GetDispositionTypes,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});