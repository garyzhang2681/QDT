Ext.define('QDT.store.RelatedDRs', {
    extend: 'Ext.data.Store',
    model:'QDT.model.DR',

    pageSize: 27,
    remoteSort: false,
    sorters: [{
        property: 'dr_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: QDT.GetRelatedDr,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});
