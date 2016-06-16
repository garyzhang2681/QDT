Ext.define('QDT.store.tq.StamperLists', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.StamperList',
    proxy: {
        type: 'direct',
        directFn: DpTq.GetStamperList,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
