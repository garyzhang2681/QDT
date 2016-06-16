Ext.define('QDT.store.ActionTypes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',

    proxy: {
        type: 'direct',
        directFn: QDT.GetActionTypes,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
