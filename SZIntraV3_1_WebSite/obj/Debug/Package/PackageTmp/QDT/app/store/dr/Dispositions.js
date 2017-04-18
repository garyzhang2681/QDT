Ext.define('QDT.store.dr.Dispositions', {
    extend:'Ext.data.Store',
    model:'QDT.model.dr.Disposition',

    proxy: {
        type: 'direct',
        directFn: 'QDT.GetDispositionByDrNumber',
        paramOrder: ['dr_num'],
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});