Ext.define('Asz.store.system.NativeUsers', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.system.NativeUser',
    autoLoad: true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.GetNativeUsers',
        paramsAsHash: true,
        reader: {
            root: 'data'
        }
    }
});