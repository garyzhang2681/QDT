Ext.define('QDT.store.cc.CcFailureCodes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',
    autoLoad: true,
    proxy: {
        type: 'direct',
        directFn: DpCc.GetCcFailureCodes,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});