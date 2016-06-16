Ext.define('QDT.store.DrSources', {
    Extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',

    proxy: {
        type: 'direct',
        directFn: QDT.GetDrSources,

        reader: {
            type:'json',
            root:'data'
        }
    }
});