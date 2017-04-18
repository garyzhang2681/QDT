Ext.define('Asz.store.util.Items', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.util.Item',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.SearchItems',
        paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});