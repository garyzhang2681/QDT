Ext.define('QDT.store.ComboDRs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.DR',

    pageSize: 10,
    remoteSort: true,
    sorters: [{
        property: 'dr.dr_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: QDT.DRListCombo,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
//        fields: [
//        // map Record's 'firstname' field to data object's key of same name
//        {name: 'dr.dr_num', mapping: 'dr.dr_num' }
//     ]
    }
});
