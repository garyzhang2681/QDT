Ext.define("QDT.store.DrTypes", {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',

    proxy: {
        type: 'direct',
        directFn: QDT.GetDrTypes,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});