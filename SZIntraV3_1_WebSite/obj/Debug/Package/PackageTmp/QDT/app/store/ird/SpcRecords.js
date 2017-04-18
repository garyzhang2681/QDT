Ext.define('QDT.store.ird.SpcRecords', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.ird.SpcRecord',

    proxy: {
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});