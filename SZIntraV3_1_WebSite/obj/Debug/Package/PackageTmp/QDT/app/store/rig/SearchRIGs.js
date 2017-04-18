Ext.define('QDT.store.rig.SearchRIGs', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.RIG',
    pageSize: 27,
    remoteSort: false,
    sorters: [{
        property: 'rig_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: DpRig.SearchRIGs,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }




});
