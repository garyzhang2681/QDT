Ext.define('QDT.store.Users', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.User',
    remoteSort: true,
    sorters: [{
        property: 'db_entry.user_id',
        direction: 'ASC'
    }],
    pageSize: 10,
    proxy: {
        type: 'direct',
        directFn: 'QDT.GetUsersInfo',
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});