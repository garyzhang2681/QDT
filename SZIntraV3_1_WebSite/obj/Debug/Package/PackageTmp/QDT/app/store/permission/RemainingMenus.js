Ext.define('QDT.store.permission.RemainingMenus', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.permission.Menu',
    proxy: {
        type: 'direct',
        directFn: 'SystemAdmin.GetRemainingMenus',
        paramOrder:['user_id'],
        reader: {
            root: 'data'
        }
    }

});