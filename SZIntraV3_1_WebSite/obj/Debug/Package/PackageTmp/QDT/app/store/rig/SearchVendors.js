Ext.define('QDT.store.rig.SearchVendors', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.VendorManagement',
    pageSize: 27,
    remoteSort: false,
    sorters: [{
        property: 'vend_num',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: DpRig.SearchVendors,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }




});
