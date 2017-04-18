Ext.define('QDT.store.permission.UserGroupMenus', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.permission.Menu',
    autoDestroy:true,
    proxy: {
        type: 'direct',
        directFn: 'SystemAdmin.GetUserGroupMenus',
        paramOrder: ['user_id'],
        reader: {
            root: 'data'
        }
    }

});