Ext.define('QDT.store.cc.CcTypes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpCc.GetCcTypes',
        reader: {
            type:'json',
            root: 'data'
        }
    }
});