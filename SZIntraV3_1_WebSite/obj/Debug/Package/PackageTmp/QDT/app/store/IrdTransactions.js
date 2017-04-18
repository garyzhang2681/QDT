Ext.define('QDT.store.IrdTransactions', {
    extend: 'Ext.date.Store',
    model: 'QDT.model.IrdTransaction',

    proxy: {
        type: 'direct',
        directFn: get, // TODO
        reader: {
            type:'json',
            root:'data',
            totolProperty:'total'
        }
    }
});