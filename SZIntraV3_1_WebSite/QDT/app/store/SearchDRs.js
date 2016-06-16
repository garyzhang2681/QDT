Ext.define('QDT.store.SearchDRs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.DR',

    pageSize: 27,
    remoteSort: false,
    sorters: [{
        property: 'dr_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: QDT.SearchDrs,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {
        beforeload: function (store, records, options) {
            Ext.apply(store.proxy.extraParams,
            {
                searchConditions: Ext.ComponentQuery.query('searchdr')[0].down('form').getForm().getValues()
            });
        }
    }
});
