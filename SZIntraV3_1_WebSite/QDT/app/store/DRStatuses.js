Ext.define("QDT.store.DRStatuses", {
    extend:'Ext.data.Store',
    model:'QDT.model.DRStatus',
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'status',
            direction: 'ASC'
        })
        ],
    pageSize: 10,
    proxy: {
        type: 'direct',
        directFn: QDT.GetDrStatuses,
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});


