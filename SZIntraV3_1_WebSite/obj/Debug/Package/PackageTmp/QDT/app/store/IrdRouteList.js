Ext.define('QDT.store.IrdRouteList', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdRouteItem',
    pageSize: 27,
    remoteSort: false,
    sorters: [{
        property: 'serial',
        direction: 'ASC'
    }],

    proxy: {
        type: 'direct',
        directFn: DpIrd.GetIrdRouteList,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});