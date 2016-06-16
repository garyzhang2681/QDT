Ext.define('Asz.store.util.SerialsLots', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.util.SerialLot',
    autoLoad: true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.SearchSerialsOrLots',
        paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});