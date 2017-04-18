Ext.define('Asz.store.system.Users', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.system.User',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.GetUsers',
        reader: {
            root: 'data'
        }
    }
});