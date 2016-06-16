Ext.define('QDT.store.IrdRecords', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdRecord',

    proxy: {
        type: 'memory',
        reader: {
            type:'json',
            root:'data',
            totalProperty:'total'
        }
    }
});