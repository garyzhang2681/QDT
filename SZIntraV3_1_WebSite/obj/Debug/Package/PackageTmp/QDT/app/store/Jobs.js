Ext.define('QDT.store.Jobs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Job',
    remoteSort: true,
    sorters: [
    new Ext.util.Sorter({
        property:'job',
        direction:'ASC'
    })
    ],
    pageSize: 10,
    proxy: {
        type: 'direct',
        directFn: QDT.QueryJobOrders,
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});