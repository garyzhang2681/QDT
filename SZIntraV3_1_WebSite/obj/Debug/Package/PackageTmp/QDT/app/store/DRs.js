Ext.define('QDT.store.DRs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.DR',

    pageSize: 10,
    remoteSort: true,
    sorters: [{
        property: 'dr_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: QDT.DRList,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {

    }
});
