Ext.define('QDT.store.dr.Actions', {
    extend:'Ext.data.Store',
    model:'QDT.model.dr.Action',

    proxy: {
        type: 'direct',
        directFn: QDT.getActionsByDisposition,
        paramOrder: ['disp_id'],
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});