Ext.define('QDT.store.permission.UserMenus', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.permission.Menu',
    proxy: {
        type: 'direct',
        directFn: 'SystemAdmin.GetUserMenus',
        paramOrder: ['user_id'],
        reader: {
            root: 'data'
        }
    }

});